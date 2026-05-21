import { translate } from '@/constants'

interface RestartBrowserModalProps {
  onClose: () => void
}

export const RestartBrowserModal = ({ onClose }: RestartBrowserModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl mx-4 p-6 flex flex-col space-y-5 shadow-xl">
        <div className="flex flex-col space-y-2">
          <p className="text-gray-100 font-semibold text-base">
            {translate('firefoxLocationModal.title')}
          </p>
          <p className="text-sm text-gray-60">
            {translate('firefoxLocationModal.description')}
          </p>
        </div>
        <button
          onClick={onClose}
          style={{ backgroundColor: 'rgb(0, 102, 255)' }}
          className="w-full py-2 px-4 rounded-lg text-sm font-medium text-white transition-colors"
        >
          {translate('firefoxLocationModal.confirm')}
        </button>
      </div>
    </div>
  )
}
