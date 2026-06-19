import { useEffect, useRef, useState } from "react";
import type { User } from "firebase/auth";
import { CheckIcon, CloseIcon } from "../components/Icons";
import { useLearning } from "../store/LearningContext";
import {
  deleteCloudLearningState,
  fetchCloudLearningState,
  getDeviceId,
  getFriendlyFirebaseError,
  loginWithEmail,
  logout,
  registerWithEmail,
  subscribeToAuthState,
  uploadCloudLearningState,
} from "../services/cloudSync";
import { isFirebaseConfigured } from "../services/firebase";
import { mergeLearningStates } from "../services/learningMerge";

const isSignupEnabled = import.meta.env.VITE_ENABLE_SIGNUP === "true";

function formatDateTime(value: string | null) {
  if (!value) return "尚未记录";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

export function SettingsPage() {
  const {
    state,
    metadata,
    reset,
    importData,
    exportData,
    setShowFurigana,
    replaceState,
    markCloudSynced,
    noteCloudSnapshot,
  } = useLearning();
  const inputRef = useRef<HTMLInputElement>(null);
  const deviceId = useRef(getDeviceId());
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(!isFirebaseConfigured);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured) return;

    try {
      return subscribeToAuthState((nextUser) => {
        setUser(nextUser);
        setAuthChecked(true);
      });
    } catch (error) {
      setAuthChecked(true);
      setMessage({ type: "error", text: getFriendlyFirebaseError(error) });
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    fetchCloudLearningState(user.uid)
      .then((cloudState) => {
        noteCloudSnapshot(cloudState?.updatedAt ?? null);
      })
      .catch((error) => {
        setMessage({ type: "error", text: getFriendlyFirebaseError(error) });
      });
  }, [noteCloudSnapshot, user]);

  const download = () => {
    const blob = new Blob([exportData()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `nihongo-studio-data-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setMessage({ type: "success", text: "学习数据已导出。" });
  };

  const handleFile = async (file?: File) => {
    if (!file) return;
    try {
      const success = importData(await file.text());
      setMessage(
        success
          ? { type: "success", text: "学习数据导入成功。" }
          : { type: "error", text: "无法识别这个文件，请选择由 Nihongo Studio 导出的 JSON 数据。" },
      );
    } catch {
      setMessage({ type: "error", text: "读取文件失败，原有学习数据没有改变。" });
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleAuth = async (mode: "login" | "register") => {
    if (mode === "register" && !isSignupEnabled) {
      setMessage({ type: "error", text: "当前站点未开放注册。请使用已创建的账号登录。" });
      return;
    }

    if (!email || !password) {
      setMessage({ type: "error", text: "请输入邮箱和密码。" });
      return;
    }

    setBusy(mode);
    try {
      await (mode === "login"
        ? loginWithEmail(email, password)
        : registerWithEmail(email, password));
      setPassword("");
      setMessage({
        type: "success",
        text: mode === "login" ? "登录成功。" : "注册成功，已登录。",
      });
    } catch (error) {
      setMessage({ type: "error", text: getFriendlyFirebaseError(error) });
    } finally {
      setBusy(null);
    }
  };

  const handleLogout = async () => {
    setBusy("logout");
    try {
      await logout();
      setMessage({ type: "success", text: "已登出。当前设备会继续使用本地数据。" });
    } catch (error) {
      setMessage({ type: "error", text: getFriendlyFirebaseError(error) });
    } finally {
      setBusy(null);
    }
  };

  const requireUser = () => {
    if (!user) {
      setMessage({ type: "error", text: "请先登录 Firebase 账号。" });
      return null;
    }

    return user;
  };

  const handleUpload = async () => {
    const currentUser = requireUser();
    if (!currentUser) return;
    if (!window.confirm("确定用本机学习记录覆盖云端记录吗？云端旧记录会被替换。")) return;

    setBusy("upload");
    try {
      const cloudState = await uploadCloudLearningState(
        currentUser.uid,
        state,
        deviceId.current,
      );
      markCloudSynced(cloudState.updatedAt);
      setMessage({ type: "success", text: "本机学习记录已上传到云端。" });
    } catch (error) {
      setMessage({ type: "error", text: getFriendlyFirebaseError(error) });
    } finally {
      setBusy(null);
    }
  };

  const handleDownloadCloud = async () => {
    const currentUser = requireUser();
    if (!currentUser) return;
    if (!window.confirm("确定从云端下载并覆盖本机学习记录吗？建议先导出 JSON 备份。")) return;

    setBusy("download");
    try {
      const cloudState = await fetchCloudLearningState(currentUser.uid);
      if (!cloudState) {
        setMessage({ type: "error", text: "云端还没有学习记录。" });
        return;
      }

      replaceState(cloudState.learningState, { markDirty: false });
      markCloudSynced(cloudState.updatedAt);
      setMessage({ type: "success", text: "已用云端学习记录更新本机。" });
    } catch (error) {
      setMessage({ type: "error", text: getFriendlyFirebaseError(error) });
    } finally {
      setBusy(null);
    }
  };

  const handleMergeCloud = async () => {
    const currentUser = requireUser();
    if (!currentUser) return;

    setBusy("merge");
    try {
      const cloudState = await fetchCloudLearningState(currentUser.uid);
      if (!cloudState) {
        setMessage({ type: "error", text: "云端还没有学习记录可合并。可以先上传本机记录。" });
        return;
      }

      replaceState(mergeLearningStates(state, cloudState.learningState), {
        markDirty: true,
      });
      noteCloudSnapshot(cloudState.updatedAt);
      setMessage({ type: "success", text: "已合并到本机。检查无误后可手动上传到云端。" });
    } catch (error) {
      setMessage({ type: "error", text: getFriendlyFirebaseError(error) });
    } finally {
      setBusy(null);
    }
  };

  const handleDeleteCloud = async () => {
    const currentUser = requireUser();
    if (!currentUser) return;
    if (!window.confirm("确定删除云端学习记录吗？本机 localStorage 数据不会被删除。")) return;

    setBusy("delete");
    try {
      await deleteCloudLearningState(currentUser.uid);
      noteCloudSnapshot(null);
      setMessage({ type: "success", text: "云端学习记录已删除，本机数据仍然保留。" });
    } catch (error) {
      setMessage({ type: "error", text: getFriendlyFirebaseError(error) });
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="page settings-page">
      <header className="page-header compact-header">
        <div><span className="eyebrow">LOCAL DATA</span><h1>设置与学习数据</h1><p>默认保存在本机。登录 Firebase 后，可以手动跨设备同步。</p></div>
        <span className="large-japanese">整</span>
      </header>

      {message && (
        <div className={`settings-message ${message.type}`}>
          {message.type === "success" ? <CheckIcon /> : <CloseIcon />}
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)}><CloseIcon /></button>
        </div>
      )}

      <section className="data-local-card">
        <div className="local-illustration"><span>LOCAL</span><strong>このブラウザ</strong></div>
        <div>
          <span className="eyebrow">PRIVACY FIRST</span>
          <h2>默认仍是本地模式</h2>
          <p>课程进度、错题、收藏和单词状态会先保存在浏览器 localStorage 中。云同步是可选的手动功能，不上传课程内容，也不会调用 AI API。</p>
        </div>
      </section>

      <section className="settings-grid">
        <article className="settings-card cloud-sync-card">
          <span className="settings-index">SYNC</span>
          <h2>云同步</h2>
          <p>使用 Firebase Authentication 登录后，可把当前学习记录手动上传、下载或合并到当前用户自己的 Firestore 文档。</p>

          <div className="sync-status-grid">
            <div><span>登录状态</span><strong>{user ? user.email ?? "已登录" : authChecked ? "未登录" : "检查中"}</strong></div>
            <div><span>当前设备 ID</span><strong>{deviceId.current}</strong></div>
            <div><span>本地最后更新</span><strong>{formatDateTime(metadata.localUpdatedAt)}</strong></div>
            <div><span>云端最后更新</span><strong>{formatDateTime(metadata.lastCloudUpdatedAt)}</strong></div>
            <div><span>最近同步</span><strong>{formatDateTime(metadata.lastSyncedAt)}</strong></div>
            <div><span>同步状态</span><strong>{metadata.hasLocalChanges ? "有本地更改未上传" : "本机暂无未上传更改"}</strong></div>
          </div>

          {!isFirebaseConfigured && (
            <div className="sync-warning">
              Firebase 尚未配置。请创建 `.env.local` 并填写 `.env.example` 中的 Vite 变量。
            </div>
          )}

          {user ? (
            <div className="sync-actions">
              <button className="button button-secondary" onClick={handleLogout} disabled={!!busy}>登出</button>
              <button className="button button-primary" onClick={handleUpload} disabled={!!busy}>上传本机记录到云端</button>
              <button className="button button-secondary" onClick={handleDownloadCloud} disabled={!!busy}>从云端下载到本机</button>
              <button className="button button-secondary" onClick={handleMergeCloud} disabled={!!busy}>合并本机与云端</button>
              <button className="button button-danger" onClick={handleDeleteCloud} disabled={!!busy}>删除云端学习记录</button>
            </div>
          ) : (
            <div className="sync-login-form">
              <label>
                <span>邮箱</span>
                <input value={email} type="email" autoComplete="email" onChange={(event) => setEmail(event.target.value)} disabled={!isFirebaseConfigured || !!busy} />
              </label>
              <label>
                <span>密码</span>
                <input value={password} type="password" autoComplete="current-password" onChange={(event) => setPassword(event.target.value)} disabled={!isFirebaseConfigured || !!busy} />
              </label>
              <div className="sync-actions">
                <button className="button button-primary" onClick={() => handleAuth("login")} disabled={!isFirebaseConfigured || !!busy}>登录</button>
                {isSignupEnabled && (
                  <button className="button button-secondary" onClick={() => handleAuth("register")} disabled={!isFirebaseConfigured || !!busy}>注册</button>
                )}
              </div>
            </div>
          )}
        </article>

        <article className="settings-card">
          <span className="settings-index">01</span>
          <h2>假名注音显示</h2>
          <p>基础阶段默认显示 furigana。关闭后，带读音的日文会回到更自然的正文行距。</p>
          <label className="furigana-setting">
            <input
              type="checkbox"
              checked={state.showFurigana}
              onChange={(event) => setShowFurigana(event.target.checked)}
            />
            <span />
            {state.showFurigana ? "显示假名注音" : "隐藏假名注音"}
          </label>
        </article>

        <article className="settings-card">
          <span className="settings-index">02</span>
          <h2>导出学习数据</h2>
          <p>下载一个 JSON 备份文件，可用于迁移到其他浏览器或稍后恢复。</p>
          <div className="data-summary">
            <span>{state.completedLessonIds.length} 个已完成单元</span>
            <span>{state.wrongAnswers.length} 道错题</span>
            <span>{state.favoriteWordIds.length} 个收藏</span>
          </div>
          <button className="button button-primary" onClick={download}>导出 JSON</button>
        </article>

        <article className="settings-card">
          <span className="settings-index">03</span>
          <h2>导入学习数据</h2>
          <p>选择此前导出的 JSON 文件。系统会先检查数据格式，错误文件不会覆盖现有记录。</p>
          <input ref={inputRef} className="visually-hidden" type="file" accept=".json,application/json" onChange={(event) => handleFile(event.target.files?.[0])} />
          <button className="button button-secondary" onClick={() => inputRef.current?.click()}>选择 JSON 文件</button>
        </article>
      </section>

      <section className="danger-zone">
        <div><span className="eyebrow">RESET</span><h2>重置所有学习进度</h2><p>这会删除课程完成状态、练习记录、错题、收藏和单词标记。</p></div>
        <button
          className="button button-danger"
          onClick={() => {
            if (window.confirm("确定重置全部学习数据吗？此操作无法撤销。")) {
              reset();
              setMessage({ type: "success", text: "学习数据已重置。" });
            }
          }}
        >
          重置学习数据
        </button>
      </section>
    </div>
  );
}
