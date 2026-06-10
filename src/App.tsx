import React, { useState, useEffect } from "react";
import {
  Sparkles,
  BookOpen,
  Download,
  Palette,
  CheckCircle,
  RefreshCw,
  MessageSquare,
  PenTool,
  Code,
  Layers,
  Award,
  Maximize2,
  Trash2,
  Copy,
  ChevronRight,
  User,
  Heart
} from "lucide-react";
import { DrawingCanvas } from "./components/DrawingCanvas";
import { HERITAGE_PRESETS, AVATAR_OPTIONS } from "./data";
import { HeritagePreset, Comment, NewspaperData } from "./types";

export default function App() {
  // Input states
  const [studentName, setStudentName] = useState("");
  const [heritageName, setHeritageName] = useState("");
  const [researchContent, setResearchContent] = useState("");
  const [drawingDesc, setDrawingDesc] = useState("");

  // Drawing state (Base64 data url)
  const [drawingImg, setDrawingImg] = useState("");

  // Current selected preset ID (for styling active preset)
  const [activePreset, setActivePreset] = useState<string | null>(null);

  // loading state
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  // Newspaper generated data
  const [newspaper, setNewspaper] = useState<NewspaperData | null>(null);

  // Client feedback comments inside the React state
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentAuthor, setNewCommentAuthor] = useState("");
  const [newCommentContent, setNewCommentContent] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("🦁");

  // Code copy helper state
  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);

  // Loading animation messages
  const LOADING_MESSAGES = [
    "편집장 AI가 돋보기를 쓰고 어린이님의 탐구 자료를 정밀 검토하는 중... 🧐",
    "조선왕조실록과 삼국유사 고문서에서 유산의 위대한 역사적 비밀을 발굴 중! 📖",
    "5학년 사회 역사 지식과 조상들의 눈부신 지혜를 기사에 녹여내는 중... 🎒",
    "대망의 1면 활판 인쇄 기기를 연달아 가동하여 가상 역사 신문을 찍어내고 있습니다! 🖨️"
  ];

  // Rotate loading message
  useEffect(() => {
    let interval: any;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 3500);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // Load preset helper
  const handleSelectPreset = (preset: HeritagePreset) => {
    setActivePreset(preset.id);
    setHeritageName(preset.name);
    setResearchContent(preset.researchNotes);
    setDrawingDesc(preset.drawingDesc);
  };

  // Click on generate request
  const handleGenerateNewspaper = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heritageName.trim() || !researchContent.trim()) {
      alert("문화유산 이름과 조사한 내용을 채워주면, 멋진 기사로 변신시켜 줄게! ✍️");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          heritageName,
          researchContent,
          drawingDesc,
          studentName: studentName.trim() || "어린이 사관"
        }),
      });

      if (!response.ok) {
        throw new Error("서버와의 연결이 부드럽지 않습니다. 잠시 후에 다시 기사 생성을 눌러 주세요!");
      }

      const data = await response.json();

      // Configure initial newspaper layout
      setNewspaper({
        newspaperTitle: data.newspaperTitle || "어린이 역사 특별신문",
        headline: data.headline || `${heritageName}, 잠들었던 천년의 찬란함이 살아나다!`,
        subheadline: data.subheadline || "조상들의 정교한 기술과 과학적 미학",
        paragraphs: data.paragraphs || [
          "우리 지역의 대표적인 자랑스러운 국가유산인 이곳에는 선조들이 남겨둔 매우 유익하고 숨은 지혜로운 역사 이야기가 듬뿍 깃들어 있습니다.",
          "역사학자들과 과학자들은 한목소리로 이 유산의 비례와 대칭, 그리고 정교한 돌 조각 기술 등이 매우 수준 높다며 지혜를 연달아 칭송하고 있습니다.",
          "5학년 어린이 기자들이 자랑스러운 우리나라 국가문화유산의 가치와 흥미로운 깊이를 더 널리 세상 사람들에게 알려가야 할 것입니다."
        ],
        editorGreetingComment: data.editorGreetingComment || "정말 대단하고 기품 있는 조사력이로구나! 훌륭하다 훌륭해!",
        editorColumn: data.editorColumn || "어린이 역사가들의 뛰어난 지적 탐구가 한가득 담겨 매우 뿌듯합니다. 조상의 뛰어난 예술성과 과학을 늘 잊지 마세요.",
        heritageName: heritageName,
        studentName: studentName.trim() || "어린이 사관",
        drawingDesc: drawingDesc || "직접 그린 그림",
        drawingImageData: drawingImg,
        theme: "classic",
        comments: [
          {
            id: "wel-1",
            author: "민우 편집장님 🦉",
            avatar: "🦉",
            content: "우리 5학년 친구의 조사는 진정한 역사학자 수준이군요! 친구들의 뜨거운 댓글 피드백을 한껏 모아주세요!",
            createdAt: new Date().toLocaleDateString("ko-KR", { hour: "2-digit", minute: "2-digit" })
          }
        ]
      });

      // Reset local reactions feedback
      setComments([
        {
          id: "wel-1",
          author: "민우 편집장님 🦉",
          avatar: "🦉",
          content: "우리 5학년 친구의 조사는 진정한 역사학자 수준이군요! 친구들의 뜨거운 댓글 피드백을 한껏 모아주세요!",
          createdAt: new Date().toLocaleDateString("ko-KR", { hour: "2-digit", minute: "2-digit" })
        }
      ]);

    } catch (err: any) {
      alert(err.message || "오류가 발생했어요. 다시 해보세요!");
    } finally {
      setIsLoading(false);
    }
  };

  // Live Inline Editing change state fallback
  const handleContentEdit = (field: keyof NewspaperData, value: any) => {
    if (!newspaper) return;
    setNewspaper({
      ...newspaper,
      [field]: value
    });
  };

  const handleParagraphEdit = (index: number, text: string) => {
    if (!newspaper) return;
    const newParagraphs = [...newspaper.paragraphs];
    newParagraphs[index] = text;
    setNewspaper({
      ...newspaper,
      paragraphs: newParagraphs
    });
  };

  // Change Theme in Active Workscreen
  const toggleTheme = (theme: "classic" | "modern" | "cute") => {
    if (!newspaper) return;
    setNewspaper({
      ...newspaper,
      theme
    });
  };

  // Add Dynamic Comment live flow
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentAuthor.trim() || !newCommentContent.trim()) {
      alert("이름과 댓글 내용을 모두 예쁘게 입력해줘! ✏️");
      return;
    }

    const newComment: Comment = {
      id: `comm-${Date.now()}`,
      author: `${newCommentAuthor.trim()} ${selectedAvatar}`,
      avatar: selectedAvatar,
      content: newCommentContent.trim(),
      createdAt: new Date().toLocaleDateString("ko-KR", { hour: "2-digit", minute: "2-digit" })
    };

    const updatedComments = [...comments, newComment];
    setComments(updatedComments);

    if (newspaper) {
      setNewspaper({
        ...newspaper,
        comments: updatedComments
      });
    }

    // Reset fields
    setNewCommentContent("");
    setNewCommentAuthor("");
  };

  // Build high quality single static HTML newspaper code download string
  const generateStandaloneCode = (): string => {
    if (!newspaper) return "";

    const theme = newspaper.theme;
    const drawingSrc = newspaper.drawingImageData || "";
    const escapedEditorGreeting = newspaper.editorGreetingComment.replace(/-->/g, "");

    // Prepare styles and backgrounds depending on themes for CSS injection
    let bodyBg = "#FAF9F5"; // classic cream
    let paperBg = "#FFFFFF";
    let titleFont = "'Noto Serif KR', serif";
    let bodyFont = "'Noto Serif KR', serif";
    let accentColor = "#7C2D12"; // amber/wood dark
    let borderStyle = "double 4px #452215";

    if (theme === "modern") {
      bodyBg = "#F1F5F9";
      paperBg = "#FFFFFF";
      titleFont = "'Inter', sans-serif";
      bodyFont = "'Inter', sans-serif";
      accentColor = "#0F172A";
      borderStyle = "solid 2px #0F172A";
    } else if (theme === "cute") {
      bodyBg = "#FFFDF0";
      paperBg = "#FFFFFF";
      titleFont = "'Gamja Flower', cursive";
      bodyFont = "'Gamja Flower', cursive";
      accentColor = "#DB2777"; // pink accent
      borderStyle = "dashed 3px #F472B6";
    }

    // Prepare comments HTML for standard initial generation
    const commentsListJSON = JSON.stringify(comments);

    return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${newspaper.headline} - ${newspaper.newspaperTitle}</title>
  <!-- 로딩할 구글 폰트 주입 -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Gamja+Flower&family=Inter:wght@400;600;800&family=Noto+Serif+KR:wght@400;700;900&family=Sunflower:wght@500;700&display=swap" rel="stylesheet">
  
  <style>
    /* 기본 공통 스타일 */
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: ${bodyBg};
      font-family: ${bodyFont};
      color: #334155;
      padding: 20px 10px;
      line-height: 1.6;
      transition: background-color 0.4s ease;
    }

    .wrapper {
      max-width: 900px;
      margin: 0 auto;
    }

    /* 테마 제어 헤더 */
    .theme-selector-bar {
      background-color: #ffffff;
      padding: 15px;
      border-radius: 12px;
      margin-bottom: 25px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.06);
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 15px;
    }

    .bar-title {
      font-weight: 800;
      color: #1e293b;
      font-size: 15px;
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: sans-serif;
    }

    .theme-buttons {
      display: flex;
      gap: 10px;
    }

    .theme-btn {
      padding: 8px 16px;
      font-size: 13px;
      font-weight: 700;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      background-color: #f8fafc;
      color: #475569;
      cursor: pointer;
      transition: all 0.2s;
    }

    .theme-btn:hover {
      background-color: #f1f5f9;
      transform: translateY(-1px);
    }

    .theme-btn.active {
      color: white;
    }

    .active-classic {
      background-color: #7C2D12 !important;
      border-color: #7c2d12 !important;
    }
    .active-modern {
      background-color: #0F172A !important;
      border-color: #0f172a !important;
    }
    .active-cute {
      background-color: #DB2777 !important;
      border-color: #db2777 !important;
    }

    /* 신문 메인 영역 */
    .newspaper {
      background-color: ${paperBg};
      border-radius: 4px;
      padding: 40px 30px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.08);
      border: ${borderStyle};
      transition: all 0.4s ease;
    }

    @media (max-width: 600px) {
      .newspaper {
        padding: 20px 15px;
      }
    }

    /* 메호 및 발행 정보 */
    .newspaper-header {
      border-bottom: 3px double #334155;
      padding-bottom: 15px;
      margin-bottom: 25px;
      text-align: center;
    }

    .newspaper-meta {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #94a3b8;
      border-top: 1px solid #94a3b8;
      padding: 6px 10px;
      font-size: 12px;
      color: #64748b;
      margin-top: 10px;
      font-family: sans-serif;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .newspaper-title {
      font-size: 42px;
      font-weight: 900;
      color: #1a1a1a;
      letter-spacing: -0.02em;
      line-height: 1.1;
    }

    /* 메인 뉴스 본문 레이아웃 */
    .newspaper-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 30px;
    }

    @media (max-width: 768px) {
      .newspaper-grid {
        grid-template-columns: 1fr;
      }
    }

    /* 정식 보도 타이틀부 */
    .article-lead {
      grid-column: 1 / -1;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 20px;
      margin-bottom: 10px;
      text-align: center;
    }

    .article-headline {
      font-size: 28px;
      font-weight: 900;
      color: ${accentColor};
      margin-bottom: 10px;
      line-height: 1.3;
      letter-spacing: -0.03em;
    }

    .article-subheadline {
      font-size: 16px;
      color: #475569;
      font-family: sans-serif;
      font-style: italic;
    }

    /* 기사 텍스트 에디터 지원 가이드 */
    [contenteditable="true"] {
      outline: none;
      position: relative;
    }
    [contenteditable="true"]:hover {
      background-color: rgba(253, 224, 71, 0.15);
      border-radius: 4px;
      cursor: text;
    }
    [contenteditable="true"]:focus {
      background-color: rgba(253, 224, 71, 0.25);
      border-radius: 4px;
      box-shadow: 0 0 0 2px #fde047;
    }

    /* 그림 박스 스타일 */
    .image-block {
      margin: 15px 0 20px;
      border: 2px dashed #cbd5e1;
      border-radius: 12px;
      background-color: #f8fafc;
      overflow: hidden;
      min-height: 220px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 10px;
      text-align: center;
    }

    .image-block img {
      width: 100%;
      max-height: 250px;
      object-fit: contain;
      border-radius: 8px;
    }

    .image-placeholder-text {
      color: #94a3b8;
      font-size: 13px;
      font-family: sans-serif;
    }

    .author-badge {
      font-family: sans-serif;
      font-size: 13px;
      background-color: #f1f5f9;
      display: inline-block;
      padding: 3px 12px;
      border-radius: 20px;
      font-weight: bold;
      color: #475569;
      margin-bottom: 15px;
    }

    /* 칼럼 / 편집장 의견 */
    .sidebar {
      background-color: #fdfaf6;
      border-left: 2px solid ${accentColor};
      padding: 20px;
      border-radius: 4px;
      height: fit-content;
    }

    .sidebar-title {
      font-size: 18px;
      color: ${accentColor};
      font-weight: 800;
      margin-bottom: 12px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 6px;
    }

    .sidebar-text {
      font-size: 14px;
      color: #475569;
      text-align: justify;
    }

    /* 댓글 섹션 */
    .comments-area {
      margin-top: 40px;
      border-top: 2px solid #cbd5e1;
      padding-top: 30px;
    }

    .comments-title {
      font-size: 18px;
      font-weight: bold;
      color: #1e293b;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: sans-serif;
    }

    .comments-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 25px;
    }

    .comment-card {
      background-color: #f8fafc;
      border: 1px solid #f1f5f9;
      border-radius: 10px;
      padding: 12px 16px;
    }

    .comment-meta {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      font-family: sans-serif;
      color: #64748b;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 4px;
      margin-bottom: 6px;
      font-weight: bold;
    }

    .comment-content {
      font-size: 13px;
      color: #334155;
    }

    /* 댓글 쓰기 폼 */
    .comment-form {
      display: grid;
      grid-template-columns: 1fr 2fr auto;
      gap: 10px;
    }

    @media (max-width: 600px) {
      .comment-form {
        grid-template-columns: 1fr;
      }
    }

    .input-field {
      padding: 10px 12px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font-size: 13px;
    }

    .select-field {
      padding: 10px 12px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font-size: 13px;
    }

    .submit-btn {
      padding: 10px 20px;
      background-color: #10b981;
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: bold;
      font-size: 13px;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .submit-btn:hover {
      background-color: #059669;
    }

    /* 클래식 테마 클래스 오버라이드 */
    .theme-classic {
      background-color: #fdfaf4 !important;
      font-family: 'Noto Serif KR', serif !important;
      border: double 4px #452215 !important;
    }
    .theme-classic .article-headline {
      color: #7C2D12 !important;
      font-family: 'Noto Serif KR', serif !important;
    }
    .theme-classic .sidebar {
      border-left-color: #7C2D12 !important;
      background-color: #fbf8f2 !important;
    }

    /* 모던 테마 클래스 오버라이드 */
    .theme-modern {
      background-color: #ffffff !important;
      font-family: 'Inter', sans-serif !important;
      border: solid 2px #0F172A !important;
      border-radius: 12px !important;
    }
    .theme-modern .article-headline {
      color: #0F172A !important;
      font-family: 'Inter', sans-serif !important;
      font-weight: 800 !important;
    }
    .theme-modern .sidebar {
      border-left-color: #0F172A !important;
      background-color: #f8fafc !important;
      border-radius: 8px !important;
    }
    .theme-modern .newspaper-header {
      border-bottom: 2px solid #0F172A !important;
    }

    /* 귀여운 테마 클래스 오버라이드 */
    .theme-cute {
      background-color: #ffffff !important;
      font-family: 'Gamja Flower', cursive !important;
      border: dashed 3px #F472B6 !important;
      border-radius: 24px !important;
    }
    .theme-cute .article-headline {
      color: #DB2777 !important;
      font-family: 'Gamja Flower', cursive !important;
      font-size: 32px !important;
    }
    .theme-cute .newspaper-title {
      font-family: 'Gamja Flower', cursive !important;
      color: #EC4899 !important;
    }
    .theme-cute .sidebar {
      border-left-color: #F472B6 !important;
      background-color: #FFF5F7 !important;
      border-radius: 16px !important;
    }
    .theme-cute .newspaper-header {
      border-bottom: 2px dashed #F472B6 !important;
    }
    .theme-cute .submit-btn {
      background-color: #EC4899 !important;
    }
    .theme-cute .submit-btn:hover {
      background-color: #DB2777 !important;
    }
  </style>
</head>
<body>

  <!-- 다정한 편집장의 숨겨진 칭찬 한마디 격려 주석 -->
  <!-- 
  [민우 편집장의 칭찬 기사 송고 레코드]
  격려 한마디: ${escapedEditorGreeting}
  조사자 학생: ${newspaper.studentName} 기자 (초등학교 5학년)
  오늘도 대한민국의 아름다운 문화유산을 사랑하고 멋지게 탐구하며 지혜를 이어가 주어서 전 직원 일동 깊이 존경하고 칭찬합니다!
  -->

  <div class="wrapper">
    <!-- 테마 제어 및 안내바 -->
    <div class="theme-selector-bar">
      <div class="bar-title">
        <span>📰 어린이 역사신문 전용 뷰어</span>
      </div>
      <div class="theme-buttons">
        <button onclick="setTheme('classic')" id="btn-classic" class="theme-btn active active-classic">📜 클래식</button>
        <button onclick="setTheme('modern')" id="btn-modern" class="theme-btn">🏢 모던</button>
        <button onclick="setTheme('cute')" id="btn-cute" class="theme-btn">🌸 귀여운</button>
      </div>
    </div>

    <!-- 신문 출력 컨테이너 -->
    <div id="newspaper-container" class="newspaper theme-${theme}">
      <div class="newspaper-header">
        <div id="newspaper-title-val" class="newspaper-title" contenteditable="true">${newspaper.newspaperTitle}</div>
        <div class="newspaper-meta">
          <div>어린이 역사 주간 특보</div>
          <div>발행처: 편집국 탐구 특별팀</div>
          <div>기자: ${newspaper.studentName}</div>
        </div>
      </div>

      <div class="newspaper-grid">
        <div class="article-lead">
          <div id="headline-val" class="article-headline" contenteditable="true">${newspaper.headline}</div>
          <div id="subheadline-val" class="article-subheadline" contenteditable="true">${newspaper.subheadline}</div>
        </div>

        <!-- 왼쪽 기사 영역 -->
        <div>
          <span class="author-badge">📝 탐구특종보도 - ${newspaper.studentName} 기자</span>
          
          <div class="image-block">
            ${
              drawingSrc
                ? `<img src="${drawingSrc}" alt="문화유산 그림" />`
                : `<div class="image-placeholder-text">🖼️여기에 직접 그린 문화유산 그림이 인쇄될 공간입니다!</div>`
            }
          </div>

          <div id="p-content" style="font-size: 15px; text-align: justify; color: #334155; display:flex; flex-direction:column; gap:12px;">
            ${newspaper.paragraphs
              .map(
                (p, idx) => `
              <p id="p-${idx}" contenteditable="true">${p}</p>
            `
              )
              .join("")}
          </div>
        </div>

        <!-- 오른쪽 컬럼 영역 -->
        <div>
          <div class="sidebar">
            <div class="sidebar-title">🦉 편집장의 한마디</div>
            <div id="editor-column-val" class="sidebar-text" contenteditable="true">
              ${newspaper.editorColumn}
            </div>
          </div>
        </div>
      </div>

      <!-- 친구들의 댓글 소통 코너 -->
      <div class="comments-area">
        <div class="comments-title">
          <span>💬 친구들의 열띤 응원 한마디 (방명록)</span>
        </div>
        
        <div id="comments-box" class="comments-list">
          <!-- 초기 피드백 댓글 주입 -->
        </div>

        <form id="comment-form-box" class="comment-form" onsubmit="addCommentEvent(event)">
          <select id="comment-avatar" class="select-field">
            <option value="🦁">🦁 씩씩한 사자</option>
            <option value="🐰">🐰 영리한 토끼</option>
            <option value="🐼">🐼 귀여운 판다</option>
            <option value="🦊">🦊 명랑한 여우</option>
            <option value="🦉">🦉 지혜 올빼미</option>
          </select>
          <input type="text" id="comment-author" placeholder="너의 이름은 뭘까?" class="input-field" required>
          <input type="text" id="comment-content" placeholder="이 훌륭한 역사 기사에 기쁜 칭찬을 나눠줘!" class="input-field" required style="grid-column: span 1;">
          <button type="submit" class="submit-btn">댓글 달기</button>
        </form>
      </div>

    </div>
  </div>

  <script>
    // 테마 설정 함수
    function setTheme(theme) {
      const container = document.getElementById("newspaper-container");
      container.className = "newspaper theme-" + theme;

      // 액티브 태그 정리
      document.getElementById("btn-classic").className = "theme-btn";
      document.getElementById("btn-modern").className = "theme-btn";
      document.getElementById("btn-cute").className = "theme-btn";

      const activeBtn = document.getElementById("btn-" + theme);
      activeBtn.className = "theme-btn active active-" + theme;
    }

    // 댓글 저장 및 연출 로직
    let activeComments = ${commentsListJSON};

    function renderComments() {
      const box = document.getElementById("comments-box");
      box.innerHTML = "";
      
      activeComments.forEach(item => {
        const card = document.createElement("div");
        card.className = "comment-card";
        card.innerHTML = \`
          <div class="comment-meta">
            <span>\${item.author}</span>
            <span>\${item.createdAt}</span>
          </div>
          <div class="comment-content">\&nbsp;\${item.content}</div>
        \`;
        box.appendChild(card);
      });
    }

    function addCommentEvent(e) {
      e.preventDefault();
      const author = document.getElementById("comment-author").value;
      const content = document.getElementById("comment-content").value;
      const avatar = document.getElementById("comment-avatar").value;
      
      if (!author.trim() || !content.trim()) return;

      const timeStr = new Date().toLocaleTimeString("ko-KR", {hour: '2-digit', minute:'2-digit'});
      const newObj = {
        id: "local-" + Date.now(),
        author: author.trim() + " " + avatar,
        content: content.trim(),
        createdAt: timeStr
      };

      activeComments.push(newObj);
      renderComments();

      // 저장
      try {
        localStorage.setItem("saved_newspaper_comments", JSON.stringify(activeComments));
      } catch(e) {}

      // 초기화
      document.getElementById("comment-author").value = "";
      document.getElementById("comment-content").value = "";
    }

    // 초기 실행
    window.onload = function() {
      // 로컬 복구
      try {
        const saved = localStorage.getItem("saved_newspaper_comments");
        if (saved) {
          activeComments = JSON.parse(saved);
        }
      } catch(e) {}
      renderComments();
    };
  </script>
</body>
</html>`;
  };

  // Download Action to save standard local single HTML
  const downloadHTMLFile = () => {
    if (!newspaper) return;
    const rawHTML = generateStandaloneCode();
    const blob = new Blob([rawHTML], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${newspaper.heritageName}_역사신문_${newspaper.studentName}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Copy raw output code
  const handleCopyCode = () => {
    const code = generateStandaloneCode();
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-stone-100 to-amber-50 text-slate-800 flex flex-col font-sans">
      
      {/* HEADER SECTION */}
      <header className="bg-white/80 backdrop-blur-md border-b border-amber-100 sticky top-0 z-30 shadow-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🦉</span>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              어린이 역사 신문 편집실
              <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                5학년 사회 탐구
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              다정하고 따뜻한 AI 편집장 전하와 함께 쓰는 최고의 인터랙티브 1면 특종!
            </p>
          </div>
        </div>

        {newspaper && (
          <button
            onClick={downloadHTMLFile}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl transition shadow-sm cursor-pointer text-sm"
          >
            <Download className="w-4.5 h-4.5" />
            <span>완성 신문 다운로드 (.html)</span>
          </button>
        )}
      </header>

      {/* BODY WORK AREA */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Input form & controls (5 / 12 width) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* INTRO FROM THE EDITOR */}
          <div className="bg-white rounded-2xl p-5 border border-amber-100 shadow-sm relative overflow-hidden">
            <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-bl from-amber-100/40 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-start gap-3.5">
              <div className="bg-amber-100 p-2.5 rounded-full text-2xl flex-shrink-0">
                🦉
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-amber-900">
                  민우 AI 편집장님의 위대한 환영 연설
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  "반갑네, 미래의 멋진 사관 친구! 우리 고장의 위대한 문화유산을 직접 탐사하고 공부했다니 정말 감동스럽군! 
                  아래에 조사한 점들을 간단히 적어주거나, 그림판에서 직접 모습을 그려주면 세련된 1면 기사로 변신시켜 주겠네!"
                </p>
              </div>
            </div>
          </div>

          {/* SCRIPT PRESET SHORTCUTS */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span>쉽고 빠른 클릭! 문화유산 조사 추천 프리셋</span>
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {HERITAGE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  type="button"
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    activePreset === preset.id
                      ? "border-amber-500 bg-amber-50/50 ring-2 ring-amber-200"
                      : "border-slate-100 bg-slate-50/70 hover:bg-slate-100/50"
                  }`}
                >
                  <div className="flex items-center gap-1.5 pb-1">
                    <span className="text-sm">{preset.defaultIcon}</span>
                    <span className="text-xs font-bold text-slate-800 line-clamp-1">{preset.name}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 line-clamp-2 leading-normal">
                    {preset.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* ACTIVE FORM */}
          <form onSubmit={handleGenerateNewspaper} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 flex items-center gap-1">
                <span className="text-amber-500">*</span>
                <span>훌륭한 탐구 학생 이름:</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs">🧑‍✈️</span>
                <input
                  type="text"
                  placeholder="예: 홍길동 (입력이 비어있으면 '어린이 사관'이 됩니다)"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 flex items-center gap-1">
                <span className="text-amber-500">*</span>
                <span>탐사할 국가유산 이름:</span>
              </label>
              <input
                type="text"
                placeholder="예: 경주 첨성대, 수원 화성, 독도 등..."
                value={heritageName}
                onChange={(e) => {
                  setHeritageName(e.target.value);
                  setActivePreset(null);
                }}
                className="w-full text-xs px-3 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none transition"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="text-amber-500">*</span>
                  <span>내가 직접 조사한 메모:</span>
                </div>
                <span className="text-[10px] text-amber-600">책이나 인터넷 조사를 더하면 정교해요!</span>
              </label>
              <textarea
                rows={5}
                placeholder="돌이 몇 개 쓰였는지, 조상들이 왜 만들었는지 등의 핵심 사실을 자유롭게 쓰세요! 편집장이 예쁘게 다듬어 드립니다."
                value={researchContent}
                onChange={(e) => {
                  setResearchContent(e.target.value);
                  setActivePreset(null);
                }}
                className="w-full text-xs p-3 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none transition resize-none leading-relaxed"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">
                내가 그린 그림에 대한 추가 설명 (선택):
              </label>
              <input
                type="text"
                placeholder="예: 동그랗고 높은 돌탑 한가운데서 별을 보는 모습"
                value={drawingDesc}
                onChange={(e) => {
                  setDrawingDesc(e.target.value);
                  setActivePreset(null);
                }}
                className="w-full text-xs px-3 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none transition"
              />
            </div>

            {/* INTEGRATED SKETCHPAD / PAINT BOX */}
            <div className="pt-2">
              <DrawingCanvas
                onSave={(base64) => {
                  setDrawingImg(base64);
                  if (newspaper) {
                    setNewspaper({
                      ...newspaper,
                      drawingImageData: base64
                    });
                  }
                }}
                initialData={drawingImg}
                placeholderText="여기에 여러분이 직접 조사한 주역 옛 문화재를 마우스나 패드로 알록달록 그려보세요!"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 rounded-xl font-bold text-white text-sm transition shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                isLoading
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-amber-650 to-orange-600 hover:from-amber-700 hover:to-orange-700 active:scale-[0.99]"
              }`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>편집장 인쇄기 세팅 중...</span>
                </>
              ) : (
                <>
                  <BookOpen className="w-4 h-4" />
                  <span>기사 작성 부탁하기 (신문 발행! 🖨️)</span>
                </>
              )}
            </button>
          </form>

        </div>

        {/* RIGHT COLUMN: Interactive Newspaper Live Preview (7 / 12 width) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* STATE 1: LOADING EFFECT */}
          {isLoading && (
            <div className="bg-white rounded-3xl border border-amber-100 p-8 flex flex-col items-center justify-center text-center shadow-md min-h-[500px]">
              <div className="w-20 h-20 relative bg-amber-50 rounded-full flex items-center justify-center mb-6 ring-8 ring-amber-100 animate-pulse">
                <span className="text-4xl animate-bounce">🖨️</span>
              </div>
              <h3 className="font-extrabold text-slate-800 text-lg mb-2">
                멋진 기사를 열심히 주조 중입니다!
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mb-6 leading-relaxed">
                조사해준 소중한 메모를 가공하여 5학년 눈높이에 꼭 맞는 알짜배기 1면 헤드라인 보도로 집필하고 있습니다.
              </p>
              
              <div className="w-full max-w-md bg-slate-100 h-2 rounded-full overflow-hidden mb-3">
                <div className="bg-amber-500 h-full animate-progress rounded-full" style={{ width: "80%" }} />
              </div>

              {/* Cycling messages */}
              <div className="bg-amber-50 text-amber-900 text-xs px-4 py-3 rounded-2xl font-medium max-w-sm border border-amber-100/60 flex items-center gap-2">
                <span>💡</span>
                <span className="text-left leading-normal">{LOADING_MESSAGES[loadingStep]}</span>
              </div>
            </div>
          )}

          {/* STATE 2: EMPTY INITIAL SCREEN */}
          {!isLoading && !newspaper && (
            <div className="bg-white/60 rounded-3xl border border-dashed border-slate-300 p-8 flex flex-col items-center justify-center text-center shadow-inner min-h-[500px]">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-2xl text-slate-400">
                📰
              </div>
              <h3 className="text-base font-bold text-slate-600 mb-1.5">
                신문 1면 인쇄용 활판이 비어있습니다
              </h3>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                왼쪽에서 추천 문화유산 프리셋을 선택하고 기사 작성을 누르거나, 여러분이 탐구한 유산을 직접 적어 독창적인 신문을 태동시켜주세요!
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2 justify-center">
                <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md font-medium">📋 실시간 글 편집 가능</span>
                <span className="text-[10px] bg-pink-50 text-pink-700 px-2 py-1 rounded-md font-medium">✨ 3개 디자인 변형</span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md font-medium">🎨 직접 도안 그리기</span>
              </div>
            </div>
          )}

          {/* STATE 3: INTERACTIVE RENDERED NEWSPAPER PORTAL */}
          {!isLoading && newspaper && (
            <div className="space-y-4">
              
              {/* LAYOUT CONTEXT CONTROLLER */}
              <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
                
                {/* Theme buttons switcher */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 mr-1.5">
                    <Palette className="w-4 h-4 text-indigo-500" />
                    <span>신문 테마 변경:</span>
                  </div>
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => toggleTheme("classic")}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition ${
                        newspaper.theme === "classic"
                          ? "bg-slate-800 text-white shadow-sm"
                          : "text-slate-600 hover:text-slate-800"
                      }`}
                    >
                      📜 클래식
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleTheme("modern")}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition ${
                        newspaper.theme === "modern"
                          ? "bg-slate-800 text-white shadow-sm"
                          : "text-slate-600 hover:text-slate-800"
                      }`}
                    >
                      🏢 모던
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleTheme("cute")}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition ${
                        newspaper.theme === "cute"
                          ? "bg-pink-600 text-white shadow-sm"
                          : "text-slate-600 hover:text-pink-600"
                      }`}
                    >
                      🌸 귀여운 (만화)
                    </button>
                  </div>
                </div>

                {/* Sub auxiliary codes layout */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setShowCode(!showCode)}
                    type="button"
                    className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-850 bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded-xl transition cursor-pointer"
                  >
                    <Code className="w-3.5 h-3.5" />
                    <span>{showCode ? "신문 보기" : "HTML 코드 전송"}</span>
                  </button>
                  <button
                    onClick={downloadHTMLFile}
                    type="button"
                    className="flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-850 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-xl transition cursor-pointer font-bold"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>다운로드</span>
                  </button>
                </div>
              </div>

              {/* EDITED NOTIFICATION TOOLTIP */}
              <div className="bg-amber-50 rounded-xl px-4 py-2 border border-amber-200/60 flex items-center justify-between text-[11px] text-amber-800">
                <div className="flex items-center gap-1.5">
                  <span>💡</span>
                  <span className="font-semibold">✏️ 기사 내 모든 글씨는 웹상에서 마우스로 클릭하여 바로 수정할 수 있어요!</span>
                </div>
                <span className="bg-amber-200/50 px-1.5 py-0.5 rounded font-bold">인터랙티브</span>
              </div>

              {/* NEWSPAPER CONTAINER BOX */}
              {showCode ? (
                /* CODE DRAWER BLOCK */
                <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 shadow-xl text-slate-200 space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🗒️</span>
                      <div>
                        <h4 className="text-xs font-bold text-slate-100">단일 독립 실행형 HTML 소스코드</h4>
                        <p className="text-[10px] text-slate-400">브라우저나 컴퓨터에 보관하여 연동되는 인쇄물 코드</p>
                      </div>
                    </div>
                    <button
                      onClick={handleCopyCode}
                      className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 active:scale-95 text-white py-1.5 px-3 rounded-lg transition"
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">복사 완료!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>전체 코드 복사</span>
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div className="relative">
                    <textarea
                      readOnly
                      rows={16}
                      value={generateStandaloneCode()}
                      className="w-full bg-slate-950 p-4 border border-slate-900 rounded-2xl text-xs font-mono text-emerald-400/95 leading-relaxed focus:outline-none focus:ring-1 focus:ring-emerald-500 overflow-y-auto"
                    />
                  </div>
                </div>
              ) : (
                /* REAL VISUAL TEMPLATE COMPONENT */
                <div
                  id="canvas-newspaper-card"
                  className={`newspaper p-6 md:p-8 border bg-white shadow-xl transition-all duration-300 ${
                    newspaper.theme === "classic"
                      ? "font-serif border-double border-4 border-amber-950 bg-stone-50 text-stone-900"
                      : newspaper.theme === "modern"
                      ? "font-sans border-solid border-2 border-slate-900 bg-white text-slate-900 rounded-2xl"
                      : "font-sans border-dashed border-3 border-pink-400 bg-white text-pink-900 rounded-[28px]"
                  }`}
                >
                  
                  {/* NEWS METADATA HEADER */}
                  <div className="text-center pb-5 mb-6 border-b border-dashed border-slate-450">
                    <div
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleContentEdit("newspaperTitle", e.target.innerText)}
                      className={`text-3xl md:text-4xl font-black tracking-tight pb-1 leading-none ${
                        newspaper.theme === "classic"
                          ? "text-stone-950"
                          : newspaper.theme === "modern"
                          ? "text-slate-900"
                          : "text-pink-600 font-bold"
                      }`}
                    >
                      {newspaper.newspaperTitle}
                    </div>

                    {/* Meta row strip */}
                    <div className="flex justify-between border-y border-slate-300 py-1.5 mt-3 px-2 text-[11px] font-mono text-slate-500">
                      <div>발행 제 5271호</div>
                      <div>태초의 천년, 역사를 잇다</div>
                      <div>기자: {newspaper.studentName}</div>
                    </div>
                  </div>

                  {/* DOUBLE COLUMN ARTICLE INFO */}
                  <div className="space-y-6">
                    
                    {/* Catchy headline banner */}
                    <div className="text-center pb-4 border-b border-double border-stone-200">
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => handleContentEdit("headline", e.target.innerText)}
                        className={`text-xl md:text-2xl font-black leading-snug tracking-tight mb-2 ${
                          newspaper.theme === "classic"
                            ? "text-amber-950 text-center"
                            : newspaper.theme === "modern"
                            ? "text-slate-950 text-left font-extrabold"
                            : "text-pink-600 text-center"
                        }`}
                      >
                        {newspaper.headline}
                      </div>
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => handleContentEdit("subheadline", e.target.innerText)}
                        className="text-xs md:text-sm text-slate-600 italic font-medium leading-relaxed"
                      >
                        {newspaper.subheadline}
                      </div>
                    </div>

                    {/* CONTENT GRIDS (Main body and Side Editorial) */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                      
                      {/* Left Article Core Content (8 cols) */}
                      <div className="md:col-span-8 space-y-4">
                        
                        {/* Kid author credit badge */}
                        <div className="inline-flex items-center gap-1.5 bg-slate-100 text-[11px] px-2.5 py-1 rounded-full font-bold text-slate-600">
                          <User className="w-3 h-3 text-slate-400" />
                          <span>꿈나무 {newspaper.studentName} 기자 특별보도</span>
                        </div>

                        {/* Rendering Image area */}
                        <div className="border rounded-2xl overflow-hidden bg-slate-50 min-h-[180px] flex flex-col items-center justify-center p-2 text-center border-dashed border-slate-200">
                          {newspaper.drawingImageData ? (
                            <img
                              src={newspaper.drawingImageData}
                              alt="직접 그린 문화유산 그림"
                              className="max-h-[220px] w-full object-contain rounded-xl hover:scale-103 transition-transform"
                            />
                          ) : (
                            <div className="text-slate-400 p-4 space-y-1">
                              <span className="text-2xl">🖼️</span>
                              <p className="text-xs font-semibold">아직 그려진 도면이 없습니다</p>
                              <p className="text-[10px] text-slate-400 leading-normal">
                                왼쪽 그림판에 유산 모양을 알록달록 그리면 여기에 인쇄돼요!
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Article body paragraphs (ContentEditable loop!) */}
                        <div className="space-y-3.5 text-xs md:text-sm leading-relaxed text-justify text-slate-800">
                          {newspaper.paragraphs.map((p, index) => (
                            <p
                              key={index}
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) => handleParagraphEdit(index, e.target.innerText)}
                              className="text-indent-4 border-b border-transparent hover:border-amber-200/50 pb-1"
                            >
                              {p}
                            </p>
                          ))}
                        </div>

                      </div>

                      {/* Right Sidebar: Editor-In-Chief's evaluation (4 cols) */}
                      <div className="md:col-span-4">
                        <div
                          className={`p-4 rounded-xl border border-amber-100 shadow-sm relative ${
                            newspaper.theme === "classic"
                              ? "bg-stone-100/70 border-amber-900/35 border-l-4 border-l-amber-900"
                              : newspaper.theme === "modern"
                              ? "bg-slate-50 border-slate-900 border-l-4 border-l-slate-900"
                              : "bg-pink-50 border-pink-400 border-l-4 border-l-pink-400"
                          }`}
                        >
                          <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-amber-100">
                            <span className="text-base">🦉</span>
                            <span className="text-xs font-extrabold text-slate-700">편집장의 한마디</span>
                          </div>
                          <div
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => handleContentEdit("editorColumn", e.target.innerText)}
                            className="text-[11px] md:text-xs leading-relaxed text-slate-600 text-justify"
                          >
                            {newspaper.editorColumn}
                          </div>
                        </div>

                        {/* Little badge of honor */}
                        <div className="mt-3 bg-white border border-yellow-200 rounded-xl p-3 flex items-center gap-2.5">
                          <span className="text-xl animate-bounce">🏆</span>
                          <div>
                            <div className="text-[10px] text-amber-800 font-extrabold">기자 최고 훈장 수여</div>
                            <div className="text-[9px] text-slate-400">다정한 민우 편집장 AI 일동 검인</div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* VISITOR GUESTBOOK COMMENTS */}
                  <div className="mt-10 pt-6 border-t border-slate-200">
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-4">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                      <span>친구들의 응원 한마디</span>
                    </h4>

                    {/* Comments list display */}
                    <div className="space-y-2 mb-4">
                      {comments.map((comm) => (
                        <div key={comm.id} className="bg-slate-55/60 rounded-xl p-3 text-[11px] leading-relaxed border border-slate-100 flex gap-2">
                          <span className="text-sm scale-110 flex-shrink-0">{comm.avatar}</span>
                          <div className="w-full">
                            <div className="flex justify-between text-[10px] font-bold text-slate-500 pb-0.5 mb-1 border-b border-dashed border-slate-150">
                              <span>{comm.author}</span>
                              <span>{comm.createdAt}</span>
                            </div>
                            <p className="text-slate-700">{comm.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* New custom comment form */}
                    <form onSubmit={handleAddComment} className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                      <div className="sm:col-span-3">
                        <select
                          value={selectedAvatar}
                          onChange={(e) => setSelectedAvatar(e.target.value)}
                          className="w-full text-[11px] bg-slate-50 px-2 py-2 border rounded-xl outline-none"
                        >
                          {AVATAR_OPTIONS.map((av) => (
                            <option key={av.emoji} value={av.emoji}>
                              {av.emoji} {av.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="sm:col-span-3">
                        <input
                          type="text"
                          placeholder="너의 이색적인 가명"
                          value={newCommentAuthor}
                          onChange={(e) => setNewCommentAuthor(e.target.value)}
                          className="w-full text-[11px] px-2.5 py-2 border rounded-xl bg-slate-50 focus:bg-white"
                          required
                        />
                      </div>
                      <div className="sm:col-span-4">
                        <input
                          type="text"
                          placeholder="칭찬 메시지를 남겨줘!"
                          value={newCommentContent}
                          onChange={(e) => setNewCommentContent(e.target.value)}
                          className="w-full text-[11px] px-2.5 py-2 border rounded-xl bg-slate-50 focus:bg-white"
                          required
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <button
                          type="submit"
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition cursor-pointer text-xs"
                        >
                          달기
                        </button>
                      </div>
                    </form>

                  </div>

                </div>
              )}

            </div>
          )}

        </div>

      </main>

      {/* FOOTER BAR */}
      <footer className="bg-slate-900 text-slate-400 py-6 mt-12 border-t border-slate-800 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="flex items-center justify-center gap-1">
            <span>만든 사람: 5학년 나라 사랑 사학자 기자단 🇰🇷 & 다정한 민우 편집장 AI 🦉</span>
          </p>
          <p className="text-[10px] text-slate-500">
            © 2026 초등학교 역사 탐색 프로젝트 신문 발행 시스템. 모든 텍스트는 자유롭게 고칠 수 있으며 다운로드는 무제한입니다.
          </p>
        </div>
      </footer>

    </div>
  );
}
