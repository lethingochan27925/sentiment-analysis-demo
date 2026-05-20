// // import { useState } from "react";

// // export default function App() {
// //   const [text, setText] = useState("");
// //   const [result, setResult] = useState(null);
// //   const [explanation, setExplanation] = useState(null);
// //   const [loading, setLoading] = useState(false);

// //   const analyzeText = async () => {
// //     if (!text.trim()) return;
// //     setLoading(true);
// //     setResult(null);
// //     setExplanation(null);

// //     try {
// //       const predictResponse = await fetch("http://127.0.0.1:8000/predict", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ text }),
// //       });
// //       const predictData = await predictResponse.json();
// //       setResult(predictData);

// //       const explainResponse = await fetch("http://127.0.0.1:8000/explain", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ text }),
// //       });
// //       const explainData = await explainResponse.json();
// //       setExplanation(explainData);
// //     } catch (err) {
// //       console.error("Error:", err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const labelColor = {
// //     positive: "#16a34a",
// //     neutral:  "#6b7280",
// //     negative: "#dc2626",
// //   };

// //   // Render tokens highlight inline — trông như đoạn text thường
// //   const renderHighlightedText = (attention) => (
// //     <p style={{ lineHeight: "2.4", fontSize: "16px", margin: 0, wordBreak: "break-word" }}>
// //       {attention.map((item, index) => {
// //         const alpha = Math.max(item.score, 0.06);
// //         const isBold = item.score > 0.6;
// //         const isDark = item.score > 0.75;
// //         // Không thêm space trước dấu câu
// //         const isPunct = /^[.,!?;:)]$/.test(item.token);
// //         return (
// //           <span key={index}>
// //             {!isPunct && index !== 0 && " "}
// //             <span
// //               title={`attention: ${(item.score * 100).toFixed(1)}%`}
// //               style={{
// //                 backgroundColor: `rgba(239, 68, 68, ${alpha})`,
// //                 borderRadius: "4px",
// //                 padding: "2px 3px",
// //                 fontWeight: isBold ? "700" : "400",
// //                 color: isDark ? "#7f1d1d" : "inherit",
// //                 cursor: "default",
// //               }}
// //             >
// //               {item.token}
// //             </span>
// //           </span>
// //         );
// //       })}
// //     </p>
// //   );

// //   return (
// //     <div
// //       style={{
// //         minHeight: "100vh",
// //         background: "#f3f4f6",
// //         display: "flex",
// //         justifyContent: "center",
// //         alignItems: "flex-start",
// //         padding: "40px 20px",
// //       }}
// //     >
// //       <div
// //         style={{
// //           background: "white",
// //           padding: "40px",
// //           borderRadius: "20px",
// //           width: "700px",
// //           boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
// //         }}
// //       >
// //         <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "30px", textAlign: "center" }}>
// //           Sentiment Analysis Demo
// //         </h1>

// //         <textarea
// //           placeholder="Nhập nội dung..."
// //           value={text}
// //           onChange={(e) => setText(e.target.value)}
// //           style={{
// //             width: "100%",
// //             height: "180px",
// //             padding: "16px",
// //             borderRadius: "12px",
// //             border: "1px solid #ccc",
// //             fontSize: "16px",
// //             outline: "none",
// //             boxSizing: "border-box",
// //             resize: "vertical",
// //             fontFamily: "inherit",
// //           }}
// //         />

// //         <button
// //           onClick={analyzeText}
// //           disabled={loading}
// //           style={{
// //             width: "100%",
// //             marginTop: "16px",
// //             padding: "14px",
// //             borderRadius: "12px",
// //             border: "none",
// //             background: loading ? "#555" : "#111",
// //             color: "white",
// //             fontSize: "17px",
// //             cursor: loading ? "not-allowed" : "pointer",
// //             transition: "background 0.2s",
// //           }}
// //         >
// //           {loading ? "Analyzing…" : "Analyze"}
// //         </button>

// //         {result && (
// //           <div style={{ marginTop: "36px" }}>

// //             {/* Prediction */}
// //             <div
// //               style={{
// //                 background: "#f9fafb",
// //                 padding: "20px 24px",
// //                 borderRadius: "12px",
// //                 borderLeft: `4px solid ${labelColor[result.label] ?? "#111"}`,
// //               }}
// //             >
// //               <h2 style={{ margin: 0, fontSize: "20px" }}>
// //                 Prediction:{" "}
// //                 <span style={{ color: labelColor[result.label], textTransform: "capitalize", fontWeight: "700" }}>
// //                   {result.label}
// //                 </span>
// //               </h2>
// //               <p style={{ marginTop: "8px", marginBottom: 0, color: "#444" }}>
// //                 Confidence:{" "}
// //                 <strong style={{ color: labelColor[result.label] }}>
// //                   {(result.confidence * 100).toFixed(2)}%
// //                 </strong>
// //               </p>
// //             </div>

// //             {/* Probability bars */}
// //             <div style={{ marginTop: "28px" }}>
// //               {[
// //                 { key: "positive", label: "Positive", color: "#16a34a" },
// //                 { key: "neutral",  label: "Neutral",  color: "#6b7280" },
// //                 { key: "negative", label: "Negative", color: "#dc2626" },
// //               ].map(({ key, label, color }) => (
// //                 <div key={key} style={{ marginBottom: "14px" }}>
// //                   <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>
// //                     <span>{label}</span>
// //                     <span>{(result.probabilities[key] * 100).toFixed(1)}%</span>
// //                   </div>
// //                   <div style={{ width: "100%", height: "18px", background: "#e5e7eb", borderRadius: "10px", overflow: "hidden" }}>
// //                     <div
// //                       style={{
// //                         width: `${result.probabilities[key] * 100}%`,
// //                         height: "100%",
// //                         background: color,
// //                         borderRadius: "10px",
// //                         transition: "width 0.4s ease",
// //                       }}
// //                     />
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>

// //             {/* XAI Attention — inline highlight */}
// //             {explanation && (
// //               <div
// //                 style={{
// //                   marginTop: "28px",
// //                   background: "#f9fafb",
// //                   padding: "20px 24px",
// //                   borderRadius: "12px",
// //                 }}
// //               >
// //                 <h2 style={{ marginBottom: "6px", fontSize: "18px" }}>
// //                   XAI Attention Visualization
// //                 </h2>
// //                 <p style={{ marginBottom: "16px", color: "#666", fontSize: "13px" }}>
// //                   Màu càng đậm = model chú ý token đó càng nhiều.
// //                 </p>

// //                 {/* Text với highlight inline */}
// //                 <div
// //                   style={{
// //                     background: "white",
// //                     borderRadius: "10px",
// //                     padding: "16px 20px",
// //                     border: "1px solid #e5e7eb",
// //                   }}
// //                 >
// //                   {renderHighlightedText(explanation.attention)}
// //                 </div>

// //                 {/* Legend */}
// //                 <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "12px", fontSize: "12px", color: "#888" }}>
// //                   <span>Ít</span>
// //                   {[0.06, 0.2, 0.4, 0.6, 0.8, 1.0].map((a) => (
// //                     <div
// //                       key={a}
// //                       style={{
// //                         width: "22px",
// //                         height: "14px",
// //                         borderRadius: "3px",
// //                         background: `rgba(239, 68, 68, ${a})`,
// //                       }}
// //                     />
// //                   ))}
// //                   <span>Nhiều</span>
// //                 </div>
// //               </div>
// //             )}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }
// import { useState } from "react";
////////////////////////////////////////////////////////
// export default function App() {
//   const [text, setText] = useState("");
//   const [result, setResult] = useState(null);
//   const [explanation, setExplanation] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const analyzeText = async () => {
//     if (!text.trim()) return;
//     setLoading(true);
//     setResult(null);
//     setExplanation(null);

//     try {
//       const predictRes = await fetch("http://127.0.0.1:8000/predict", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ text }),
//       });
//       setResult(await predictRes.json());

//       const explainRes = await fetch("http://127.0.0.1:8000/explain", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ text }),
//       });
//       setExplanation(await explainRes.json());
//     } catch (err) {
//       console.error("Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const labelColor = {
//     positive: "#16a34a",
//     neutral: "#6b7280",
//     negative: "#dc2626",
//   };

//   // Render đoạn văn liền, từng word được tô màu theo attention score
//   const renderHighlight = (attention) => (
//     <div
//       style={{
//         fontSize: "16px",
//         lineHeight: "2",
//         background: "white",
//         borderRadius: "10px",
//         padding: "16px 20px",
//         border: "1px solid #e5e7eb",
//         fontFamily: "inherit",
//       }}
//     >
//       {attention.map((item, i) => {
//         const score = item.score;
//         // Màu nền: trắng → đỏ theo score
//         const r = 239;
//         const g = Math.round(68 + (255 - 68) * (1 - score));
//         const b = Math.round(68 + (255 - 68) * (1 - score));
//         const bg = score < 0.1
//           ? "transparent"
//           : `rgb(${r}, ${g}, ${b})`;

//         const isPunct = /^[.,!?;:'")]$/.test(item.word);

//         return (
//           <span key={i}>
//             {!isPunct && i !== 0 ? " " : ""}
//             <span
//               title={`attention: ${(score * 100).toFixed(1)}%`}
//               style={{
//                 backgroundColor: bg,
//                 borderRadius: "3px",
//                 padding: score >= 0.1 ? "1px 2px" : "0",
//                 fontWeight: score > 0.65 ? "700" : "400",
//                 color: score > 0.8 ? "#fff" : "inherit",
//                 cursor: "default",
//                 transition: "background-color 0.2s",
//               }}
//             >
//               {item.word}
//             </span>
//           </span>
//         );
//       })}
//     </div>
//   );

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: "#f3f4f6",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "flex-start",
//         padding: "40px 20px",
//       }}
//     >
//       <div
//         style={{
//           background: "white",
//           padding: "40px",
//           borderRadius: "20px",
//           width: "700px",
//           boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
//         }}
//       >
//         <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "30px", textAlign: "center" }}>
//           Sentiment Analysis Demo
//         </h1>

//         <textarea
//           placeholder="Nhập nội dung..."
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           style={{
//             width: "100%",
//             height: "180px",
//             padding: "16px",
//             borderRadius: "12px",
//             border: "1px solid #ccc",
//             fontSize: "16px",
//             outline: "none",
//             boxSizing: "border-box",
//             resize: "vertical",
//             fontFamily: "inherit",
//           }}
//         />

//         <button
//           onClick={analyzeText}
//           disabled={loading}
//           style={{
//             width: "100%",
//             marginTop: "16px",
//             padding: "14px",
//             borderRadius: "12px",
//             border: "none",
//             background: loading ? "#555" : "#111",
//             color: "white",
//             fontSize: "17px",
//             cursor: loading ? "not-allowed" : "pointer",
//           }}
//         >
//           {loading ? "Analyzing…" : "Analyze"}
//         </button>

//         {result && (
//           <div style={{ marginTop: "36px" }}>

//             {/* Prediction */}
//             <div
//               style={{
//                 background: "#f9fafb",
//                 padding: "20px 24px",
//                 borderRadius: "12px",
//                 borderLeft: `4px solid ${labelColor[result.label] ?? "#111"}`,
//               }}
//             >
//               <h2 style={{ margin: 0, fontSize: "20px" }}>
//                 Prediction:{" "}
//                 <span style={{ color: labelColor[result.label], textTransform: "capitalize", fontWeight: "700" }}>
//                   {result.label}
//                 </span>
//               </h2>
//               <p style={{ marginTop: "8px", marginBottom: 0, color: "#444" }}>
//                 Confidence:{" "}
//                 <strong style={{ color: labelColor[result.label] }}>
//                   {(result.confidence * 100).toFixed(2)}%
//                 </strong>
//               </p>
//             </div>

//             {/* Probability bars */}
//             <div style={{ marginTop: "28px" }}>
//               {[
//                 { key: "positive", label: "Positive", color: "#16a34a" },
//                 { key: "neutral",  label: "Neutral",  color: "#6b7280" },
//                 { key: "negative", label: "Negative", color: "#dc2626" },
//               ].map(({ key, label, color }) => (
//                 <div key={key} style={{ marginBottom: "14px" }}>
//                   <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>
//                     <span>{label}</span>
//                     <span>{(result.probabilities[key] * 100).toFixed(1)}%</span>
//                   </div>
//                   <div style={{ width: "100%", height: "18px", background: "#e5e7eb", borderRadius: "10px", overflow: "hidden" }}>
//                     <div style={{ width: `${result.probabilities[key] * 100}%`, height: "100%", background: color, borderRadius: "10px", transition: "width 0.4s ease" }} />
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* XAI */}
//             {explanation && (
//               <div style={{ marginTop: "28px", background: "#f9fafb", padding: "20px 24px", borderRadius: "12px" }}>
//                 <h2 style={{ marginBottom: "6px", fontSize: "18px" }}>XAI Attention Visualization</h2>
//                 <p style={{ marginBottom: "14px", color: "#666", fontSize: "13px" }}>
//                   Màu càng đậm = model chú ý từ đó càng nhiều khi phân tích cảm xúc.
//                 </p>

//                 {renderHighlight(explanation.attention)}

//                 {/* Legend */}
//                 <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "10px", fontSize: "12px", color: "#888" }}>
//                   <span>Ít</span>
//                   {[0.1, 0.3, 0.5, 0.7, 0.85, 1.0].map((s) => {
//                     const g = Math.round(68 + (255 - 68) * (1 - s));
//                     return (
//                       <div
//                         key={s}
//                         style={{
//                           width: "22px",
//                           height: "14px",
//                           borderRadius: "3px",
//                           background: `rgb(239, ${g}, ${g})`,
//                         }}
//                       />
//                     );
//                   })}
//                   <span>Nhiều</span>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { useState } from "react";

export default function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [igData, setIgData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("attention");

  const analyzeText = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);
    setExplanation(null);
    setIgData(null);

    try {
      const predictRes = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      setResult(await predictRes.json());

      const explainRes = await fetch("http://127.0.0.1:8000/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      setExplanation(await explainRes.json());

      const igRes = await fetch("http://127.0.0.1:8000/explain_ig", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      setIgData(await igRes.json());
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const labelColor = {
    positive: "#16a34a",
    neutral: "#6b7280",
    negative: "#dc2626",
  };

  // Attention: trắng → đỏ (code gốc của bạn, giữ nguyên)
  const renderHighlight = (attention) => (
    <div style={{ fontSize: "16px", lineHeight: "2", background: "white", borderRadius: "10px", padding: "16px 20px", border: "1px solid #e5e7eb", fontFamily: "inherit" }}>
      {attention.map((item, i) => {
        const score = item.score;
        const r = 239;
        const g = Math.round(68 + (255 - 68) * (1 - score));
        const b = Math.round(68 + (255 - 68) * (1 - score));
        const bg = score < 0.1 ? "transparent" : `rgb(${r}, ${g}, ${b})`;
        const isPunct = /^[.,!?;:'")]$/.test(item.word);
        return (
          <span key={i}>
            {!isPunct && i !== 0 ? " " : ""}
            <span
              title={`attention: ${(score * 100).toFixed(1)}%`}
              style={{
                backgroundColor: bg,
                borderRadius: "3px",
                padding: score >= 0.1 ? "1px 2px" : "0",
                fontWeight: score > 0.65 ? "700" : "400",
                color: score > 0.8 ? "#fff" : "inherit",
                cursor: "default",
                transition: "background-color 0.2s",
              }}
            >
              {item.word}
            </span>
          </span>
        );
      })}
    </div>
  );

  // IG: xanh = ủng hộ predicted class, đỏ = phản đối
  const renderIG = (ig) => (
    <div style={{ fontSize: "16px", lineHeight: "2", background: "white", borderRadius: "10px", padding: "16px 20px", border: "1px solid #e5e7eb", fontFamily: "inherit" }}>
      {ig.map((item, i) => {
        const s = item.score;
        const abs = Math.abs(s);
        const isPunct = /^[.,!?;:'")]$/.test(item.word);

        let bg = "transparent";
        let textColor = "inherit";
        let fw = "400";

        if (abs >= 0.08) {
          bg = s > 0
            ? `rgba(22, 163, 74, ${Math.min(abs * 0.9, 1)})`   // xanh lá
            : `rgba(220, 38, 38, ${Math.min(abs * 0.9, 1)})`;  // đỏ
          if (abs > 0.85) textColor = "#fff";
          if (abs > 0.6) fw = "700";
        }

        return (
          <span key={i}>
            {!isPunct && i !== 0 ? " " : ""}
            <span
              title={`${s > 0 ? "+" : ""}${(s * 100).toFixed(1)}% — ${s > 0 ? "ủng hộ" : "phản đối"} ${result?.label}`}
              style={{
                backgroundColor: bg,
                borderRadius: "3px",
                padding: abs >= 0.08 ? "1px 2px" : "0",
                fontWeight: fw,
                color: textColor,
                cursor: "default",
                transition: "background-color 0.2s",
              }}
            >
              {item.word}
            </span>
          </span>
        );
      })}
    </div>
  );

  const tabStyle = (tab) => ({
    padding: "7px 18px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    background: activeTab === tab ? "#111" : "#e5e7eb",
    color: activeTab === tab ? "#fff" : "#555",
    transition: "all 0.2s",
  });

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "40px 20px" }}>
      <div style={{ background: "white", padding: "40px", borderRadius: "20px", width: "700px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>

        <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "30px", textAlign: "center" }}>
          Sentiment Analysis Demo
        </h1>

        <textarea
          placeholder="Nhập nội dung..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ width: "100%", height: "180px", padding: "16px", borderRadius: "12px", border: "1px solid #ccc", fontSize: "16px", outline: "none", boxSizing: "border-box", resize: "vertical", fontFamily: "inherit" }}
        />

        <button
          onClick={analyzeText}
          disabled={loading}
          style={{ width: "100%", marginTop: "16px", padding: "14px", borderRadius: "12px", border: "none", background: loading ? "#555" : "#111", color: "white", fontSize: "17px", cursor: loading ? "not-allowed" : "pointer" }}
        >
          {loading ? "Analyzing…" : "Analyze"}
        </button>

        {result && (
          <div style={{ marginTop: "36px" }}>

            {/* Prediction */}
            <div style={{ background: "#f9fafb", padding: "20px 24px", borderRadius: "12px", borderLeft: `4px solid ${labelColor[result.label] ?? "#111"}` }}>
              <h2 style={{ margin: 0, fontSize: "20px" }}>
                Prediction:{" "}
                <span style={{ color: labelColor[result.label], textTransform: "capitalize", fontWeight: "700" }}>
                  {result.label}
                </span>
              </h2>
              <p style={{ marginTop: "8px", marginBottom: 0, color: "#444" }}>
                Confidence:{" "}
                <strong style={{ color: labelColor[result.label] }}>
                  {(result.confidence * 100).toFixed(2)}%
                </strong>
              </p>
            </div>

            {/* Probability bars */}
            <div style={{ marginTop: "28px" }}>
              {[
                { key: "positive", label: "Positive", color: "#16a34a" },
                { key: "neutral",  label: "Neutral",  color: "#6b7280" },
                { key: "negative", label: "Negative", color: "#dc2626" },
              ].map(({ key, label, color }) => (
                <div key={key} style={{ marginBottom: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>
                    <span>{label}</span>
                    <span>{(result.probabilities[key] * 100).toFixed(1)}%</span>
                  </div>
                  <div style={{ width: "100%", height: "18px", background: "#e5e7eb", borderRadius: "10px", overflow: "hidden" }}>
                    <div style={{ width: `${result.probabilities[key] * 100}%`, height: "100%", background: color, borderRadius: "10px", transition: "width 0.4s ease" }} />
                  </div>
                </div>
              ))}
            </div>

            {/* XAI — 2 tabs */}
            {(explanation || igData) && (
              <div style={{ marginTop: "28px", background: "#f9fafb", padding: "20px 24px", borderRadius: "12px" }}>
                <h2 style={{ marginBottom: "14px", fontSize: "18px" }}>XAI Explanation</h2>

                {/* Tab buttons */}
                <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                  <button style={tabStyle("attention")} onClick={() => setActiveTab("attention")}>
                    Attention
                  </button>
                  <button style={tabStyle("ig")} onClick={() => setActiveTab("ig")}>
                    Integrated Gradients
                  </button>
                </div>

                {/* Attention tab */}
                {activeTab === "attention" && explanation && (
                  <>
                    <p style={{ fontSize: "13px", color: "#666", marginBottom: "12px", marginTop: 0 }}>
                      Màu càng đậm = model chú ý từ đó càng nhiều khi phân tích cảm xúc.
                    </p>
                    {renderHighlight(explanation.attention)}
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "10px", fontSize: "12px", color: "#888" }}>
                      <span>Ít</span>
                      {[0.1, 0.3, 0.5, 0.7, 0.85, 1.0].map((s) => {
                        const g = Math.round(68 + (255 - 68) * (1 - s));
                        return <div key={s} style={{ width: "22px", height: "14px", borderRadius: "3px", background: `rgb(239, ${g}, ${g})` }} />;
                      })}
                      <span>Nhiều</span>
                    </div>
                  </>
                )}

                {/* IG tab */}
                {activeTab === "ig" && igData && (
                  <>
                    <p style={{ fontSize: "13px", color: "#666", marginBottom: "12px", marginTop: 0 }}>
                      <span style={{ color: "#16a34a", fontWeight: "600" }}>Xanh</span> = ủng hộ <strong>{igData.label}</strong>
                      {" · "}
                      <span style={{ color: "#dc2626", fontWeight: "600" }}>Đỏ</span> = phản đối. Hover để xem chi tiết.
                    </p>
                    {renderIG(igData.ig)}
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "10px", fontSize: "12px", color: "#888" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        {[0.3, 0.6, 1.0].map((s) => (
                          <div key={s} style={{ width: "22px", height: "14px", borderRadius: "3px", background: `rgba(220, 38, 38, ${s * 0.9})` }} />
                        ))}
                        <span>Phản đối</span>
                      </div>
                      <span style={{ color: "#ddd" }}>|</span>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        {[0.3, 0.6, 1.0].map((s) => (
                          <div key={s} style={{ width: "22px", height: "14px", borderRadius: "3px", background: `rgba(22, 163, 74, ${s * 0.9})` }} />
                        ))}
                        <span>Ủng hộ</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}