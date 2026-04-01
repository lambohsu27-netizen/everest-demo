import { MyRichTextEditor, MyButton } from '@interstellar-component'

export default function EditorSection({ title, content, onUpdate }) {
  return (
    <section className="flex flex-col py-8">
      <div className="flex flex-col xl:flex-row gap-8 mb-6">
        <header className="w-full xl:w-[280px] shrink-0 flex flex-col gap-1">
          <label className="text-sm font-semibold text-[#414651]">
            {title} <span className="text-[#7f56d9]">*</span>
          </label>
          <p className="text-sm text-[#535862]">Write a short introduction.</p>
        </header>

        <div className="flex-1 w-full max-w-[996px] flex flex-col gap-1.5">
          <MyRichTextEditor content={content} onChange={onUpdate} />
          <p className="text-sm text-[#535862]">275 characters left</p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-5 mt-4 border-t border-[#e9eaeb]">
        <MyButton color="secondary" size="md" variant="outlined">
          Cancel
        </MyButton>
        <MyButton color="primary" size="md" variant="filled">
          Save
        </MyButton>
      </div>
    </section>
  )
}
