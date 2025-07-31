"use client"

import React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  TreePine,
  Coffee,
  Save,
  BookOpen,
  Circle,
  Moon,
  Sun,
  Snowflake,
  Flower,
  Leaf,
  Sunrise,
  Expand,
  Minimize,
} from "lucide-react"

const themes = [
  {
    id: "plain",
    name: "Plain",
    icon: Circle,
  },
  {
    id: "forest",
    name: "Forest",
    icon: TreePine,
  },
  {
    id: "cafe",
    name: "Café",
    icon: Coffee,
  },
  {
    id: "spring",
    name: "Spring",
    icon: Flower,
  },
  {
    id: "summer",
    name: "Summer",
    icon: Sun,
  },
  {
    id: "autumn",
    name: "Autumn",
    icon: Leaf,
  },
  {
    id: "winter",
    name: "Winter",
    icon: Snowflake,
  },
  {
    id: "sunrise",
    name: "Sunrise",
    icon: Sunrise,
  },
  {
    id: "night",
    name: "Night",
    icon: Moon,
  },
]

interface SavedDocument {
  id: string
  title: string
  content: string
  createdAt: Date
  wordCount: number
}

const getThemeStyles = (theme: string) => {
  switch (theme) {
    case "forest":
      return {
        background: "bg-gradient-to-br from-green-50 to-emerald-100",
        textColor: "text-slate-800",
        placeholderColor: "placeholder-slate-500",
      }
    case "cafe":
      return {
        background: "bg-gradient-to-br from-amber-50 to-orange-100",
        textColor: "text-amber-900",
        placeholderColor: "placeholder-amber-600",
      }
    case "spring":
      return {
        background: "bg-gradient-to-br from-pink-50 to-green-100",
        textColor: "text-slate-800",
        placeholderColor: "placeholder-slate-500",
      }
    case "summer":
      return {
        background: "bg-gradient-to-br from-yellow-50 to-orange-100",
        textColor: "text-slate-800",
        placeholderColor: "placeholder-slate-500",
      }
    case "autumn":
      return {
        background: "bg-gradient-to-br from-orange-50 to-red-100",
        textColor: "text-slate-800",
        placeholderColor: "placeholder-slate-500",
      }
    case "winter":
      return {
        background: "bg-gradient-to-br from-blue-50 to-slate-100",
        textColor: "text-slate-800",
        placeholderColor: "placeholder-slate-500",
      }
    case "sunrise":
      return {
        background: "bg-gradient-to-br from-orange-100 to-pink-100",
        textColor: "text-slate-800",
        placeholderColor: "placeholder-slate-500",
      }
    case "night":
      return {
        background: "bg-black",
        textColor: "text-white",
        placeholderColor: "placeholder-gray-400",
      }
    default: // plain
      return {
        background: "bg-stone-50",
        textColor: "text-stone-800",
        placeholderColor: "placeholder-stone-400",
      }
  }
}

export default function ZenFocus() {
  const [text, setText] = useState("")
  const [activeTheme, setActiveTheme] = useState("plain")
  const [focusMode, setFocusMode] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [showLibrary, setShowLibrary] = useState(false)
  const [savedDocuments, setSavedDocuments] = useState<SavedDocument[]>([])
  const [currentDocId, setCurrentDocId] = useState<string | null>(null)

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length
    setWordCount(words)
  }, [text])

  useEffect(() => {
    // Load saved documents from localStorage
    const saved = localStorage.getItem("zen-focus-documents")
    if (saved) {
      const docs = JSON.parse(saved).map((doc: any) => ({
        ...doc,
        createdAt: new Date(doc.createdAt),
      }))
      setSavedDocuments(docs)
    }
  }, [])

  const selectTheme = (themeId: string) => {
    setActiveTheme(themeId)
  }

  const toggleFocusMode = () => {
    setFocusMode(!focusMode)
  }

  const generateTitle = (content: string): string => {
    if (content.trim() === "") return `Document ${savedDocuments.length + 1}`

    // Split into sentences and get the first meaningful sentence
    const sentences = content.trim().split(/[.!?]+/).filter(s => s.trim().length > 0)

    if (sentences.length > 0) {
      const firstSentence = sentences[0].trim()
      // If first sentence is reasonable length (10-60 chars), use it
      if (firstSentence.length >= 10 && firstSentence.length <= 60) {
        return firstSentence
      }
      // If too long, take first 50 characters and add ellipsis
      if (firstSentence.length > 60) {
        return firstSentence.substring(0, 50).trim() + "..."
      }
    }

    // Fallback: use first 8 words (better than 5)
    const words = content.trim().split(/\s+/)
    if (words.length <= 8) {
      return words.join(" ")
    }
    return words.slice(0, 8).join(" ") + "..."
  }

  const saveDocument = () => {
    if (text.trim() === "") return

    const title = generateTitle(text)

    const newDoc: SavedDocument = {
      id: currentDocId || Date.now().toString(),
      title,
      content: text,
      createdAt: new Date(),
      wordCount,
    }

    const updatedDocs = currentDocId
      ? savedDocuments.map((doc) => (doc.id === currentDocId ? newDoc : doc))
      : [...savedDocuments, newDoc]

    setSavedDocuments(updatedDocs)
    setCurrentDocId(newDoc.id)
    localStorage.setItem("zen-focus-documents", JSON.stringify(updatedDocs))
  }

  const loadDocument = (doc: SavedDocument) => {
    setText(doc.content)
    setCurrentDocId(doc.id)
    setShowLibrary(false)
  }

  const newDocument = () => {
    setText("")
    setCurrentDocId(null)
    setShowLibrary(false)
  }

  const deleteDocument = (docId: string) => {
    const updatedDocs = savedDocuments.filter((doc) => doc.id !== docId)
    setSavedDocuments(updatedDocs)
    localStorage.setItem("zen-focus-documents", JSON.stringify(updatedDocs))
    if (currentDocId === docId) {
      setText("")
      setCurrentDocId(null)
    }
  }

  const themeStyles = getThemeStyles(activeTheme)
  const isDarkMode = activeTheme === "night"

  return (
    <div className={`min-h-screen ${themeStyles.background} relative transition-all duration-500`}>
      {/* Top Controls */}
      <div
        className={`fixed top-0 left-0 right-0 backdrop-blur-sm border-b border-stone-200/50 z-10 ${isDarkMode ? "bg-black/80" : "bg-white/80"
          }`}
      >
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className={`text-xl font-light ${isDarkMode ? "text-white" : "text-stone-700"}`}>Zen Focus</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFocusMode}
              className={`${isDarkMode ? "text-gray-300 hover:text-white" : "text-stone-600 hover:text-stone-800"}`}
            >
              {focusMode ? <Expand className="w-4 h-4" /> : <Minimize className="w-4 h-4" />}
            </Button>
          </div>

          {!focusMode && (
            <div className="mt-4 max-w-6xl mx-auto px-2">
              {/* Theme Selection */}
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {themes.map((theme) => {
                  const IconComponent = theme.icon
                  return (
                    <Button
                      key={theme.id}
                      variant="ghost"
                      size="sm"
                      onClick={() => selectTheme(theme.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${activeTheme === theme.id
                        ? isDarkMode
                          ? "bg-gray-800 text-white"
                          : "bg-stone-200 text-stone-800"
                        : isDarkMode
                          ? "hover:bg-gray-800 text-gray-300"
                          : "hover:bg-stone-100 text-stone-600"
                        }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="text-sm">{theme.name}</span>
                    </Button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Writing Area */}
      <div className="pt-20 pb-20 px-4">
        <div className="max-w-6xl mx-auto" style={{ marginTop: focusMode ? "1rem" : "2rem" }}>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What is on your mind?"
            className={`w-full min-h-[75vh] p-6 text-lg leading-relaxed bg-transparent border-0 outline-none resize-none ${themeStyles.textColor} ${themeStyles.placeholderColor} font-light scrollbar-hide`}
            style={{
              fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
              lineHeight: "1.8",
              scrollbarWidth: "none", // Firefox
              msOverflowStyle: "none", // IE and Edge
            }}
          />
        </div>
      </div>

      {/* Library Modal */}
      {showLibrary && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-stone-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-light text-stone-800">Library</h2>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={newDocument} className="text-stone-600">
                    New Document
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowLibrary(false)} className="text-stone-600">
                    Close
                  </Button>
                </div>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {savedDocuments.length === 0 ? (
                <p className="text-stone-500 text-center py-8">No saved documents yet</p>
              ) : (
                <div className="space-y-3">
                  {savedDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-4 border border-stone-200 rounded-lg hover:bg-stone-50 cursor-pointer group"
                      onClick={() => loadDocument(doc)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-stone-800 mb-1">{doc.title}</h3>
                          <p className="text-sm text-stone-500">{doc.createdAt.toLocaleDateString()}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteDocument(doc.id)
                          }}
                          className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Stats and Controls */}
      <div
        className={`fixed bottom-0 left-0 right-0 backdrop-blur-sm border-t border-stone-200/50 z-30 ${isDarkMode ? "bg-black/80" : "bg-white/80"
          }`}
      >
        <div className="px-6 py-3">
          <div
            className={`flex items-center justify-between text-sm ${isDarkMode ? "text-gray-300" : "text-stone-600"}`}
          >
            <div className="flex items-center gap-6">
              {activeTheme !== "plain" && (
                <div className="flex items-center gap-2 text-xs">
                  {themes.find((t) => t.id === activeTheme) && (
                    <>
                      {React.createElement(themes.find((t) => t.id === activeTheme)!.icon, {
                        className: `w-3 h-3 ${isDarkMode ? "text-gray-300" : "text-stone-600"}`,
                      })}
                      <span className="capitalize">{activeTheme}</span>
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLibrary(true)}
                className={`${isDarkMode ? "text-gray-300 hover:text-white" : "text-stone-600 hover:text-stone-800"}`}
              >
                <BookOpen className="w-4 h-4 mr-1" />
                Library
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={saveDocument}
                className={`${isDarkMode ? "text-gray-300 hover:text-white" : "text-stone-600 hover:text-stone-800"}`}
                disabled={text.trim() === ""}
              >
                <Save className="w-4 h-4 mr-1" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
