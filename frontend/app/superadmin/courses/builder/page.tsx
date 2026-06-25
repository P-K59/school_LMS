"use client";

import React, { useState, useEffect } from "react";
import { useMockData, Course, Module, Lesson, Quiz } from "../../../context/MockDataContext";
import { GlassCard } from "../../../components/Card";
import {
  Plus,
  Video,
  FileText,
  Trash2,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Play,
  CheckCircle2,
  Upload,
  BookOpen,
  ArrowRight,
  PlusCircle,
  HelpCircle,
} from "lucide-react";

export default function CourseBuilderPage() {
  const { courses, addCourse, updateCourse, addActivity } = useMockData();
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  
  // Course creation state
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCategory, setNewCategory] = useState("Computer Science");
  const [newPrice, setNewPrice] = useState(499);

  // Active state
  const activeCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];

  // UI state
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  
  // Modals & temporary states
  const [activeModuleForLesson, setActiveModuleForLesson] = useState<string | null>(null);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newLessonDuration, setNewLessonDuration] = useState("15 mins");
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [isAddingModule, setIsAddingModule] = useState(false);

  // Video Upload Simulation State
  const [uploadingLessonId, setUploadingLessonId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "transcoding" | "done">("idle");

  // AI Quiz Generator State
  const [quizTopic, setQuizTopic] = useState("");
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState<Omit<Quiz, "id"> | null>(null);
  const [generationStep, setGenerationStep] = useState(0);

  useEffect(() => {
    if (courses.length > 0 && !selectedCourseId) {
      setSelectedCourseId(courses[0].id);
    }
  }, [courses, selectedCourseId]);

  const toggleModule = (modId: string) => {
    setExpandedModules((prev) => ({ ...prev, [modId]: !prev[modId] }));
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    
    addCourse({
      title: newTitle,
      description: newDesc,
      category: newCategory,
      defaultPrice: newPrice,
      modules: [],
      quizzes: [],
    });

    setNewTitle("");
    setNewDesc("");
    setIsCreatingCourse(false);
  };

  const handleAddModule = () => {
    if (!newModuleTitle || !activeCourse) return;

    const newModule: Module = {
      id: `mod-${Date.now()}`,
      title: newModuleTitle,
      lessons: [],
    };

    const updatedCourse = {
      ...activeCourse,
      modules: [...activeCourse.modules, newModule],
    };

    updateCourse(updatedCourse);
    setNewModuleTitle("");
    setIsAddingModule(false);
    addActivity(`Added module "${newModuleTitle}" to course: ${activeCourse.title}`, "System");
  };

  const handleAddLesson = (modId: string) => {
    if (!newLessonTitle || !activeCourse) return;

    const newLesson: Lesson = {
      id: `les-${Date.now()}`,
      title: newLessonTitle,
      duration: newLessonDuration,
    };

    const updatedCourse = {
      ...activeCourse,
      modules: activeCourse.modules.map((m) => {
        if (m.id === modId) {
          return { ...m, lessons: [...m.lessons, newLesson] };
        }
        return m;
      }),
    };

    updateCourse(updatedCourse);
    setNewLessonTitle("");
    setActiveModuleForLesson(null);
  };

  // Video Upload Simulator
  const simulateVideoUpload = (lessonId: string) => {
    setUploadingLessonId(lessonId);
    setUploadStatus("uploading");
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadStatus("transcoding");
          
          setTimeout(() => {
            setUploadStatus("done");
            if (activeCourse) {
              const updatedCourse = {
                ...activeCourse,
                modules: activeCourse.modules.map((m) => ({
                  ...m,
                  lessons: m.lessons.map((l) => {
                    if (l.id === lessonId) {
                      return { ...l, videoUrl: "https://eduverse.stream/v/890214" };
                    }
                    return l;
                  }),
                })),
              };
              updateCourse(updatedCourse);
              addActivity(`Uploaded lecture video for lesson in course: ${activeCourse.title}`, "System");
            }
            setTimeout(() => {
              setUploadingLessonId(null);
              setUploadStatus("idle");
            }, 1000);
          }, 1500);

          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  // AI Quiz Generator simulation
  const simulateAIQuizGeneration = () => {
    if (!quizTopic) return;
    setIsGeneratingQuiz(true);
    setGenerationStep(0);
    setGeneratedQuiz(null);

    // Step-by-step animation
    const steps = [
      "Analyzing topic outline...",
      "Generating multiple choice questionnaires...",
      "Formulating answers & explanations...",
      "Polishing quiz model...",
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      setGenerationStep(currentStep);
      if (currentStep >= steps.length) {
        clearInterval(interval);
        
        // Final generated quiz payload
        const quiz: Omit<Quiz, "id"> = {
          title: `Quiz: ${quizTopic}`,
          questions: [
            {
              id: `q_${Date.now()}_1`,
              question: `Which core concept is central to understanding ${quizTopic}?`,
              options: [
                "Declarative State Management",
                "Asynchronous Event Loops",
                "Procedural Flow Control",
                "Standard Relational Schema Mapping",
              ],
              answer: 0,
            },
            {
              id: `q_${Date.now()}_2`,
              question: `What is the primary benefit of mastering ${quizTopic}?`,
              options: [
                "Increases computational compile overhead",
                "Optimizes system resource usage and response speed",
                "Enforces legacy backward-compatibility loops",
                "Restricts user routing customization layers",
              ],
              answer: 1,
            },
          ],
        };
        setGeneratedQuiz(quiz);
        setIsGeneratingQuiz(false);
      }
    }, 900);
  };

  const handleAddAIQuizToCourse = () => {
    if (!generatedQuiz || !activeCourse) return;

    const newQuiz: Quiz = {
      ...generatedQuiz,
      id: `quiz-${Date.now()}`,
    };

    const updatedCourse = {
      ...activeCourse,
      quizzes: [...activeCourse.quizzes, newQuiz],
    };

    updateCourse(updatedCourse);
    setGeneratedQuiz(null);
    setQuizTopic("");
    addActivity(`AI Quiz "${newQuiz.title}" successfully added to course: ${activeCourse.title}`, "System");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-hanken font-bold text-4xl text-on-surface tracking-tight">Course Builder & AI tools</h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Construct course syllabi, upload lesson videos, and generate assessments with artificial intelligence.
          </p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-xl text-sm font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
          <button
            onClick={() => setIsCreatingCourse(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary-container shadow-premium transition-colors"
          >
            <Plus size={16} /> New Course
          </button>
        </div>
      </div>

      {/* Main Grid: Syllabus tree (left) & AI Quiz / Video Uploader (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Syllabus / Module Builder */}
        <div className="lg:col-span-2 space-y-6">
          {isCreatingCourse ? (
            <GlassCard>
              <h3 className="font-hanken font-bold text-lg text-slate-800 mb-4">Create Platform Course</h3>
              <form onSubmit={handleCreateCourse} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold font-geist text-slate-500 uppercase tracking-wider mb-1.5">Course Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Docker & Kubernetes Masterclass"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold font-geist text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
                  <textarea
                    placeholder="Provide a comprehensive course description..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 h-24"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold font-geist text-slate-500 uppercase tracking-wider mb-1.5">Category</label>
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold font-geist text-slate-500 uppercase tracking-wider mb-1.5">Default Pricing (INR)</label>
                    <input
                      type="number"
                      value={newPrice}
                      onChange={(e) => setNewPrice(Number(e.target.value))}
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreatingCourse(false)}
                    className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary-container shadow-premium transition-colors"
                  >
                    Create Course
                  </button>
                </div>
              </form>
            </GlassCard>
          ) : activeCourse ? (
            <GlassCard>
              <div className="flex items-start justify-between border-b border-slate-200/80 pb-4 mb-6">
                <div>
                  <span className="text-[10px] font-geist font-bold text-primary uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                    {activeCourse.category}
                  </span>
                  <h2 className="font-hanken font-bold text-2xl text-slate-800 mt-2">{activeCourse.title}</h2>
                  <p className="text-slate-500 text-sm mt-1">{activeCourse.description}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 font-medium">Default Price</span>
                  <p className="text-xl font-bold text-slate-800 font-hanken">₹{activeCourse.defaultPrice}</p>
                </div>
              </div>

              {/* Module Syllabus outline */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-hanken font-bold text-base text-slate-800">Syllabus Outline</h3>
                  <button
                    onClick={() => setIsAddingModule(true)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-container"
                  >
                    <Plus size={14} /> Add Module
                  </button>
                </div>

                {/* Add Module Input inline */}
                {isAddingModule && (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="Module Title (e.g. Deep Dive into Context)"
                      value={newModuleTitle}
                      onChange={(e) => setNewModuleTitle(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-sm border border-slate-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <button
                      onClick={handleAddModule}
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-primary rounded-lg hover:bg-primary-container"
                    >
                      Save Module
                    </button>
                    <button
                      onClick={() => setIsAddingModule(false)}
                      className="text-xs text-slate-500 hover:text-slate-700"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {activeCourse.modules.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-sm bg-slate-50/50 border border-dashed border-slate-200 rounded-xl">
                    No curriculum modules created. Add a module to begin.
                  </div>
                ) : (
                  activeCourse.modules.map((m) => {
                    const isExpanded = expandedModules[m.id];
                    return (
                      <div key={m.id} className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                        {/* Module header */}
                        <div
                          onClick={() => toggleModule(m.id)}
                          className="flex items-center justify-between p-4 bg-slate-50/50 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            <span className="font-bold text-slate-800 text-sm">{m.title}</span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveModuleForLesson(m.id);
                            }}
                            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                          >
                            <Plus size={12} /> Lesson
                          </button>
                        </div>

                        {/* Lessons list */}
                        {isExpanded && (
                          <div className="p-4 space-y-3.5 divide-y divide-slate-100">
                            {/* Inline form to add lesson */}
                            {activeModuleForLesson === m.id && (
                              <div className="p-3 bg-slate-50 rounded-lg flex items-center gap-3 border border-slate-200 mb-3">
                                <input
                                  type="text"
                                  placeholder="Lesson Title"
                                  value={newLessonTitle}
                                  onChange={(e) => setNewLessonTitle(e.target.value)}
                                  className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                                />
                                <input
                                  type="text"
                                  placeholder="Duration (e.g. 15 mins)"
                                  value={newLessonDuration}
                                  onChange={(e) => setNewLessonDuration(e.target.value)}
                                  className="w-24 px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                                />
                                <button
                                  onClick={() => handleAddLesson(m.id)}
                                  className="px-3.5 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-container"
                                >
                                  Add
                                </button>
                                <button
                                  onClick={() => setActiveModuleForLesson(null)}
                                  className="text-xs text-slate-500 hover:text-slate-700"
                                >
                                  Cancel
                                </button>
                              </div>
                            )}

                            {m.lessons.length === 0 ? (
                              <div className="text-center py-6 text-slate-400 text-xs">
                                No lessons added to this module yet.
                              </div>
                            ) : (
                              m.lessons.map((l) => (
                                <div key={l.id} className="flex items-center justify-between pt-3.5 first:pt-0">
                                  <div className="flex items-start gap-3">
                                    <Play size={15} className="text-slate-400 mt-1 shrink-0" />
                                    <div>
                                      <p className="text-xs font-semibold text-slate-800 leading-snug">{l.title}</p>
                                      <span className="text-[10px] font-geist text-slate-400 mt-1 block">{l.duration}</span>
                                    </div>
                                  </div>
                                  <div>
                                    {l.videoUrl ? (
                                      <span className="flex items-center gap-1.5 text-emerald-600 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100">
                                        <CheckCircle2 size={13} /> Video Ready
                                      </span>
                                    ) : uploadingLessonId === l.id ? (
                                      <div className="text-right w-36">
                                        <span className="text-[10px] font-bold font-geist text-primary block uppercase tracking-wider mb-1">
                                          {uploadStatus === "uploading" ? `Uploading ${uploadProgress}%` : "Transcoding..."}
                                        </span>
                                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                          <div
                                            className="bg-primary h-full transition-all duration-300"
                                            style={{ width: `${uploadStatus === "transcoding" ? 90 : uploadProgress}%` }}
                                          />
                                        </div>
                                      </div>
                                    ) : (
                                      <button
                                        onClick={() => simulateVideoUpload(l.id)}
                                        className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-primary px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
                                      >
                                        <Upload size={13} /> Upload Video
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Quizzes List inside syllabus */}
              <div className="mt-8 border-t border-slate-200/80 pt-6">
                <h3 className="font-hanken font-bold text-base text-slate-800 mb-4">Course Assessments</h3>
                {activeCourse.quizzes.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs bg-slate-50/50 border border-dashed border-slate-200 rounded-xl">
                    No quizzes published. Use the AI generator on the right to compile questions instantly.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeCourse.quizzes.map((q) => (
                      <div key={q.id} className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                            <FileText size={15} className="text-slate-400" /> {q.title}
                          </h4>
                          <p className="text-xs text-slate-400 font-geist mt-1.5">{q.questions.length} Questions generated</p>
                        </div>
                        <div className="border-t border-slate-100 mt-4 pt-3 space-y-2">
                          {q.questions.map((qs, idx) => (
                            <div key={qs.id} className="text-xs">
                              <span className="font-bold text-slate-800">{idx + 1}.</span> {qs.question}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </GlassCard>
          ) : (
            <div className="text-center py-20 text-slate-400 text-sm">
              Please create a course to begin syllabus building.
            </div>
          )}
        </div>

        {/* AI Quiz Generator Panel */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-indigo-100 bg-gradient-to-b from-indigo-50/30 to-white shadow-premium relative ai-glow-border ai-mesh-bg overflow-hidden flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="text-indigo-600 animate-pulse" size={20} />
              <h3 className="font-hanken font-bold text-lg text-slate-900">AI Quiz Generator</h3>
            </div>
            
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Create premium syllabus assessments in seconds. Enter a curriculum topic and our LLM engine compiles multiple choice questions, options, and verified answers.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold font-geist text-slate-400 uppercase tracking-wider mb-1.5">Lecture Topic or Outline</label>
                <input
                  type="text"
                  placeholder="e.g. React Hook Lifecycle, Thermodynamics"
                  value={quizTopic}
                  disabled={isGeneratingQuiz}
                  onChange={(e) => setQuizTopic(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 bg-white/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {isGeneratingQuiz ? (
                <div className="p-5 rounded-xl border border-indigo-50 bg-indigo-50/30 flex flex-col items-center justify-center text-center">
                  <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin mb-3" />
                  <p className="text-xs font-bold text-indigo-900 font-geist">
                    {["Analyzing topic outline...", "Generating questions...", "Formulating answers...", "Polishing quiz..."][generationStep] || "Processing..."}
                  </p>
                </div>
              ) : generatedQuiz ? (
                <div className="space-y-4 p-4.5 rounded-xl bg-white border border-indigo-200 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800">{generatedQuiz.title}</h4>
                    <span className="text-[9px] font-bold font-geist bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full border border-indigo-100">
                      GENERATED
                    </span>
                  </div>
                  
                  <div className="space-y-3 divide-y divide-slate-100">
                    {generatedQuiz.questions.map((q, idx) => (
                      <div key={q.id} className="text-xs pt-3 first:pt-0">
                        <p className="font-bold text-slate-800">{idx + 1}. {q.question}</p>
                        <div className="grid grid-cols-1 gap-1.5 mt-2 pl-2 border-l-2 border-indigo-100">
                          {q.options.map((opt, oIdx) => (
                            <span
                              key={opt}
                              className={`p-1 px-2 rounded font-medium text-[11px] ${
                                oIdx === q.answer ? "bg-emerald-50 text-emerald-700 font-semibold" : "text-slate-500"
                              }`}
                            >
                              {opt} {oIdx === q.answer && "✓"}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={handleAddAIQuizToCourse}
                      className="flex-1 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors text-center"
                    >
                      Add to Selected Course
                    </button>
                    <button
                      onClick={() => setGeneratedQuiz(null)}
                      className="py-2 px-3 rounded-xl text-xs font-bold border border-slate-300 hover:bg-slate-50 text-slate-600 transition-colors"
                    >
                      Discard
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={simulateAIQuizGeneration}
                  disabled={!quizTopic}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles size={14} /> Generate Quiz
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
