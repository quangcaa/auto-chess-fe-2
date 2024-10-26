import { useState } from 'react'
import { EditProfile } from '../components/setting/EditProfile'
import { ChangePassword } from '../components/setting/ChangePassword'
import { CloseAccount } from '../components/setting/CloseAccount'

export const Setting = () => {
  const [activePage, setActivePage] = useState('EditProfile')

  return (
    <div className="flex flex-row justify-center h-screen">
      <div className="w-3/5 flex">
        <div className="w-1/5 p-4">
          <div className="flex flex-col space-y-4">
            {['EditProfile', 'ChangePassword', 'CloseAccount'].map((page) => (
              <p
                key={page}
                onClick={() => setActivePage(page)}
                className={`cursor-pointer ${activePage === page ? 'text-red-500' : 'text-black'}`}
              >
                {page.replace(/([A-Z])/g, ' $1').trim()}
              </p>
            ))}
          </div>
        </div>

        <div className="w-4/5 mt-1 mx-auto">
          {activePage === 'EditProfile' && <EditProfile />}
          {activePage === 'ChangePassword' && <ChangePassword />}
          {activePage === 'CloseAccount' && <CloseAccount />}
        </div>

      </div>
    </div>
  )
}
