import React from 'react'

import forumImage from './../assets/images/forum.svg'

export const Forum = () => {
  return (
    <div className='flex flex-col items-center'>
        <div className='bg-white p-4 w-3/4'>
        <div className='flex flex-row items-center gap-4'>
            <img src={forumImage} alt='forum' className='h-20' /> 
            <p className='text-3xl'>AutoChess Forum</p>
        </div>
        <table className='w-full'>
            <tr className='bg-gray-300'>
                <td></td>
                <td>
                    <p>Topic</p>
                </td>
                <td>
                    <p>Posts</p>
                </td>
                <td>
                    <p>Last Post</p>
                </td>
            </tr>
            <tbody>
                <tr style={{ margin: '10px' }}>
                    <td className='flex flex-col items-start gap-1 justify-center mx-3 my-5'>
                        <p className='text-3xl text-blue-500'>
                            General Chess Discussion 
                        </p>
                        <p>
                        The place to discuss general chess topics
                        </p>
                    </td>
                    <td>
                        <p>69,191</p>
                    </td>
                    <td>
                        <p>620,334</p>
                    </td>
                    <td className='flex flex-col items-start gap-1 justify-center my-5'>
                        <p className='text-blue-500'>1 hour ago</p>
                        <p>by FunnyAnimatorJimTV</p>
                    </td>
                </tr>
                <tr className='bg-gray-300'>
                    <td className='flex flex-col items-start gap-1 justify-center mx-3 my-5'>
                        <p className='text-3xl text-blue-500'>
                        Lichess Feedback
                        </p>
                        <p>
                        Bug reports, feature requests, suggestions
                        </p>
                    </td>
                    <td>
                        <p>69,191</p>
                    </td>
                    <td>
                        <p>620,334</p>
                    </td>
                    <td className='flex flex-col items-start gap-1 justify-center my-5'>
                        <p className='text-blue-500'>1 hour ago</p>
                        <p>by FunnyAnimatorJimTV</p>
                    </td>
                </tr>
                <tr>
                    <td className='flex flex-col items-start gap-1 justify-center mx-3 my-5'>
                        <p className='text-3xl text-blue-500'>
                        Game analysis
                        </p>
                        <p>
                        Show your game and analyse it with the community
                        </p>
                    </td>
                    <td>
                        <p>69,191</p>
                    </td>
                    <td>
                        <p>620,334</p>
                    </td>
                    <td className='flex flex-col items-start gap-1 justify-center my-5'>
                        <p className='text-blue-500'>1 hour ago</p>
                        <p>by FunnyAnimatorJimTV</p>
                    </td>
                </tr>
                <tr className='bg-gray-300'>
                    <td className='flex flex-col items-start gap-1 justify-center mx-3 my-5'>
                        <p className='text-3xl text-blue-500'>
                        Off-Topic Discussion
                        </p>
                        <p>
                        Everything that isn't related to chess
                        </p>
                    </td>
                    <td>
                        <p>69,191</p>
                    </td>
                    <td>
                        <p>620,334</p>
                    </td>
                    <td className='flex flex-col items-start gap-1 justify-center my-5'>
                        <p className='text-blue-500'>1 hour ago</p>
                        <p>by FunnyAnimatorJimTV</p>
                    </td>
                </tr>
            </tbody>
        </table>
        </div>
    </div>
  )
}

export default Forum