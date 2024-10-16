import React from 'react'
import backImage from "./../assets/images/back.png";
import nonactive from "./../assets/images/nonactive.png";

export const Follow = () => {
  return (
    <div className='flex bg-gray-200 justify-center'>
        <div className='flex flex-col bg-white w-2/3 bg-center h-screen'>
        <div className='flex flex-row m-10 items-center'>
            <img src={backImage} alt='Back' className='h-7' />
            <p className='text-3xl ml-5'>Follow</p>
        </div>
        <div className='flex flex-col items-center mt-5'>
            <table className='w-11/12'>
                <tbody>
                    <tr className='w-full'>
                        <td className='flex flex-row items-center'>
                            <img src={nonactive} alt='nonactive' className='h-3' />
                            <p className='ml-2'>an123456tp</p>
                        </td>
                        <td>
                            <p>3 games</p>
                        </td>
                        <td className='relative right-0'>
                            <p>Active <span className='text-gray-500'>2 hours ago</span></p>
                        </td>
                    </tr>
                    <tr className='w-full'>
                        <td className='flex flex-row items-center'>
                            <img src={nonactive} alt='nonactive' className='h-3' />
                            <p className='ml-2'>an123456tpaefheuighoerhgiurehgueh</p>
                        </td>
                        <td>
                            <p>3 games</p>
                        </td>
                        <td className='relative right-0'>
                            <p>Active <span className='text-gray-500'>2 hours ago</span></p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    </div>
  )
}
