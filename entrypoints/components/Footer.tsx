const HOST_AUTH = 'https://staging.drive.internxt.com'
// const HOST_AUTH = 'http://localhost:3000'
//  import.meta.env.VITE_AUTH_HOST_URL

interface FooterProps {
  isAuthAvailable: boolean
  isAuthenticated: boolean
  onLogOut: () => void
}

const AuthButtons = ({
  isAuthenticated,
  onLogOut,
}: Pick<FooterProps, 'isAuthenticated' | 'onLogOut'>) => (
  <div className="flex flex-row w-full items-center gap-2">
    {isAuthenticated ? (
      <button
        className="flex hover:underline bg-transparent text-sm font-medium text-primary"
        onClick={onLogOut}
      >
        Log out
      </button>
    ) : (
      <>
        <a
          href={`${HOST_AUTH}/login?vpnAuth=true`}
          target="_blank"
          className="flex hover:underline text-sm font-medium text-primary"
        >
          Log in
        </a>
        <div className="flex h-full border-gray-1" />
        <a
          href={`${HOST_AUTH}/new?vpnAuth=true`}
          target="_blank"
          className="flex hover:underline text-sm font-medium text-primary"
        >
          Sign up
        </a>
      </>
    )}
  </div>
)

export const Footer = ({
  isAuthAvailable,
  isAuthenticated,
  onLogOut,
}: FooterProps) => (
  <div className="flex h-full items-center p-5 flex-row w-full justify-between">
    {isAuthAvailable && (
      <AuthButtons isAuthenticated={isAuthenticated} onLogOut={onLogOut} />
    )}
    <div className="flex max-w-[100px] w-full flex-col">
      <a href={'https://internxt.com'} target="_blank">
        <img
          src="/icon/internxt-logo.svg"
          width={97}
          height={10}
          alt="Internxt"
        />
      </a>
    </div>
  </div>
)
