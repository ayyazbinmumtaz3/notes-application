import {
  AdmonitionDirectiveDescriptor,
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  codeBlockPlugin,
  codeMirrorPlugin,
  CodeToggle,
  CreateLink,
  directivesPlugin,
  headingsPlugin,
  imagePlugin,
  InsertAdmonition,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  ListsToggle,
  markdownShortcutPlugin,
  MDXEditor,
  quotePlugin,
  realmPlugin,
  Separator,
  StrikeThroughSupSubToggles,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  UndoRedo,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import React, { useEffect, useState } from "react";
import { CloseIcon, Regenerate } from "../../assets/icons";
import TagInput from "../../components/input/TagInput";
import axiosInstance from "../../utils/axiosInstance";

const AddEditNote = ({ data, getAllNotes, type, onClose }) => {
  const [title, setTitle] = useState(data?.title || "");
  const [content, setContent] = useState(data?.content || "");
  const [tags, setTags] = useState(data?.tags || []);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const mdxEditorRef = React.useRef(null);

  useEffect(() => {
    mdxEditorRef.current?.setMarkdown(data?.content || "");
  }, [data]);

  // get generated note
  const generatedNote = async () => {
    setIsGenerating(true);
    try {
      const prompt = title;
      const response = await axiosInstance.post(`/generate-note`, { prompt });
      console.log(response.data.result, { mdxEditorRef });
      mdxEditorRef.current?.setMarkdown(response.data.result);
      setContent(response.data.result);
      setError(null);
    } catch (error) {
      console.error(
        "Error in generate note:",
        error.response ? error.response.data : error
      );
      setError("Failed to generate note");
    } finally {
      setIsGenerating(false);
    }
  };

  // add notes
  const addNewNote = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/add-note", {
        title,
        content,
        tags,
      });
      if (response.data && response.data.note) {
        getAllNotes();
        onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  //edit notes
  const editNote = async (data) => {
    if (!data || !data._id) {
      setError("Invalid note data");
      console.log("Invalid note data");
      return;
    }
    const noteId = data._id;
    setIsLoading(true);
    try {
      const response = await axiosInstance.put(`/edit-note/${noteId}`, {
        title,
        content,
        tags,
      });
      if (response.data && response.data.note) {
        getAllNotes();
        onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNote = () => {
    if (!title) {
      setError("Please enter the title");
      return;
    }

    if (!content) {
      setError("Please enter the content");
      return;
    }

    setError(null);

    if (type === "edit") {
      editNote(data);
    } else {
      addNewNote();
    }
  };

  const generateNote = () => {
    generatedNote(title);
  };

  const regenerateNote = () => {
    generatedNote();
  };

  const rotateStyle = {
    transition: "transform 0.5s linear",
    transform: isGenerating ? "rotate(360deg)" : "rotate(0deg)",
  };

  return (
    <div className="relative">
      <button
        onClick={onClose}
        className="flex w-10 h-10 rounded-full outline-none items-center justify-center -right-3 -top-3 absolute hover:bg-slate-50"
      >
        <CloseIcon className="text-xl text-slate-800" />
      </button>
      <div className="flex flex-col">
        <label className="input-label">Title</label>
        <div className="flex justify-between items-center">
          <input
            className="text-2xl text-slate-950 w-[45rem] p-2 rounded-md border border-gray-50 600 outline-none"
            type="text"
            placeholder="Type title/prompt"
            value={title}
            onChange={({ target }) => {
              setTitle(target.value);
            }}
          />
          <div className="flex items-center gap-3">
            <button
              className="border border-slate-200 hover:bg-gray-100 my-3 p-2 rounded-md font-medium text-slate-500"
              onClick={generateNote}
              disabled={isGenerating}
            >
              {isGenerating ? "Generating" : "Generate"}
            </button>
            <Regenerate
              className="text-slate-500 cursor-pointer"
              onClick={regenerateNote}
              disabled={isGenerating}
              style={rotateStyle}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 my-2">
        <label className="input-label">Add/Edit Note</label>
        {/* <ReactMarkdown className="max-h-[300px]">{content}</ReactMarkdown> */}
        <MDXEditor
          ref={mdxEditorRef}
          contentEditableClassName="prose"
          className="px-2 mdx-editor max-h-[300px] overflow-y-auto"
          markdown={content}
          placeholder="Add your note here..."
          onChange={(updatedContent) => {
            setContent(updatedContent);
            mdxEditorRef.current?.setMarkdown(updatedContent);
          }}
          plugins={[
            toolbarPlugin({
              toolbarContents: () => (
                <>
                  <UndoRedo />
                  <Separator />
                  <BoldItalicUnderlineToggles />
                  <CodeToggle />
                  <Separator />
                  <BlockTypeSelect />
                  <StrikeThroughSupSubToggles />
                  <Separator />
                  <ListsToggle />
                  <Separator />
                  <InsertTable />
                  <InsertAdmonition />
                  <InsertThematicBreak />
                  <InsertImage />
                  <CreateLink />
                  {/* <ConditionalContents
                    options={[
                      {
                        when: (editor) => editor?.editorType === "codeblock",
                        contents: () => <ChangeCodeMirrorLanguage />,
                      },

                      {
                        fallback: () => <InsertCodeBlock />,
                      },
                    ]}
                  /> */}
                </>
              ),
            }),
            headingsPlugin(),
            directivesPlugin({
              directiveDescriptors: [AdmonitionDirectiveDescriptor],
            }),
            listsPlugin(),
            imagePlugin(),
            quotePlugin(),
            realmPlugin(),
            linkPlugin(),
            linkDialogPlugin(),
            thematicBreakPlugin(),
            tablePlugin(),
            thematicBreakPlugin(),
            codeBlockPlugin({ defaultCodeBlockLanguage: "txt" }),
            codeMirrorPlugin({
              codeBlockLanguages: {
                javascript: "JavaScript",
                typescript: "TypeScript",
                jsx: "JSX",
                tsx: "TSX",
                html: "HTML",
                css: "CSS",
                scss: "SCSS",
                less: "LESS",
                xml: "XML",
                json: "JSON",
                yaml: "YAML",
                markdown: "Markdown",
                python: "Python",
                ruby: "Ruby",
                php: "PHP",
                java: "Java",
                kotlin: "Kotlin",
                c: "C",
                cpp: "C++",
                csharp: "C#",
                go: "Go",
                rust: "Rust",
                swift: "Swift",
                dart: "Dart",
                r: "R",
                shell: "Shell",
                bash: "Bash",
                powershell: "Powershell",
                perl: "Perl",
                lua: "Lua",
                sql: "SQL",
                plsql: "PL/SQL",
                visualbasic: "Visual Basic",
                assembly: "Assembly",
                scala: "Scala",
                groovy: "Groovy",
                clojure: "Clojure",
                fsharp: "F#",
                elixir: "Elixir",
                haskell: "Haskell",
                erlang: "Erlang",
                matlab: "MATLAB",
                tex: "TeX",
                latex: "LaTeX",
                dockerfile: "Dockerfile",
                ini: "INI",
                toml: "TOML",
                graphql: "GraphQL",
                sass: "SASS",
                protobuf: "Protocol Buffers",
                thrift: "Thrift",
                haxe: "Haxe",
                zig: "Zig",
              },
              autoLoadLanguageSupport: true,
            }),

            markdownShortcutPlugin(),
          ]}
        />
      </div>

      <div className="mt-4">
        <label className="input-label">Tags</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>
      {error && <p className="text-red-500 text-xs pt-4">{error}</p>}
      <button
        className="text-gray-900 text-lg bg-neutral-200 hover:bg-neutral-300 rounded-md w-full font-medium mt-5 p-3"
        onClick={() => {
          handleAddNote();
        }}
        disabled={isLoading}
      >
        {type === "edit"
          ? isLoading
            ? "Updating..."
            : "Update"
          : isLoading
          ? "Adding..."
          : "Add"}
      </button>
    </div>
  );
};

export default AddEditNote;
