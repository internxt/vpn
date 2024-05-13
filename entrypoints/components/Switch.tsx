export default function ToggleSwitch({
  isChecked,
  onToggleClicked,
}: Readonly<{
  isChecked: boolean
  onToggleClicked: () => void
}>) {
  return (
    <div className="flex items-center justify-center">
      <label htmlFor="toggle" className="flex items-center cursor-pointer">
        <div className="relative">
          <input
            id="toggle"
            type="checkbox"
            className="hidden"
            checked={isChecked}
            onChange={onToggleClicked}
          />
          <div
            className={`w-12 h-6 ${
              isChecked ? 'bg-green' : 'bg-[#E5E5EB]'
            } rounded-full shadow-inner`}
          ></div>
          <div
            className={`absolute w-6 h-6 rounded-full shadow bg-white left-0 top-0 transition-transform ${
              isChecked ? 'transform translate-x-full' : ''
            }`}
          ></div>
        </div>
      </label>
    </div>
  )
}
