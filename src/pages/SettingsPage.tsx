import { useRef, useState } from "react";
import { CheckIcon, CloseIcon } from "../components/Icons";
import { useLearning } from "../store/LearningContext";

export function SettingsPage() {
  const { state, reset, importData, exportData, setShowFurigana } = useLearning();
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

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

  return (
    <div className="page settings-page">
      <header className="page-header compact-header">
        <div><span className="eyebrow">LOCAL DATA</span><h1>设置与学习数据</h1><p>掌控自己的学习记录，不需要账号或云端服务。</p></div>
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
          <h2>数据只保存在当前浏览器</h2>
          <p>课程进度、错题、收藏和单词状态都保存在浏览器的 localStorage 中。本项目没有后端、登录或云同步，也不会调用 AI API。</p>
        </div>
      </section>

      <section className="settings-grid">
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
