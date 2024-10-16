import React from "react";
import backImage from "./../assets/images/back.png";

export const Topic = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white p-4 w-3/4 ">
        <div className="flex flex-row justify-between items-center m-7">
          <div className="flex flex-row items-center gap-4">
            <img src={backImage} alt="forum" className="h-8" />
            <p className="text-3xl">General Chess Discussion</p>
          </div>
          <p className="text-green-500 font-bold">CREATE A NEW TOPIC</p>
        </div>
        <table className="w-full">
          <tr className="bg-gray-300">
            <td></td>
            <td>
              <p>Replies</p>
            </td>
            <td>
              <p>Last Post</p>
            </td>
          </tr>
          <tbody>
            <tr>
              <td className="my-5">
                <p className=" mx-10 text-xl text-blue-500">
                    Threefold repetition “offer a” draw
                </p>
              </td>
              <td>
                <p className="mr-5">62</p>
              </td>
              <td className="flex flex-col items-start gap-1 justify-center my-5">
                <p className="text-blue-500">1 hour ago</p>
                <p>by FunnyAnimatorJimTV</p>
              </td>
            </tr>
            <tr className="bg-gray-300">
              <td className="my-5">
                <p className=" mx-10 text-xl text-blue-500">
                I think someone broke a record on lichess
                </p>
              </td>
              <td>
                <p className="mr-5">62,345</p>
              </td>
              <td className="flex flex-col items-start gap-1 justify-center my-5">
                <p className="text-blue-500">1 hour ago</p>
                <p>by FunnyAnimatorJimTV</p>
              </td>
            </tr>
            <tr>
              <td className="my-5">
                <p className=" mx-10 text-xl text-blue-500">
                How to make ChessBase work ?
                </p>
              </td>
              <td>
                <p className="mr-5">62,4344</p>
              </td>
              <td className="flex flex-col items-start gap-1 justify-center my-5">
                <p className="text-blue-500">1 hour ago</p>
                <p>by FunnyAnimatorJimTV</p>
              </td>
            </tr>
            <tr  className="bg-gray-300">
              <td className="my-5">
                <p className=" mx-10 text-xl text-blue-500">
                How to stop losing?
                </p>
              </td>
              <td>
                <p className="mr-5">62,345</p>
              </td>
              <td className="flex flex-col items-start gap-1 justify-center my-5">
                <p className="text-blue-500">1 hour ago</p>
                <p>by FunnyAnimatorJimTV</p>
              </td>
            </tr>
            <tr>
              <td className="my-5">
                <p className=" mx-10 text-xl text-blue-500">
                what does top players play for a win as black today?
                </p>
              </td>
              <td>
                <p className="mr-5">62</p>
              </td>
              <td className="flex flex-col items-start gap-1 justify-center my-5">
                <p className="text-blue-500">1 hour ago</p>
                <p>by FunnyAnimatorJimTV</p>
              </td>
            </tr>
            <tr  className="bg-gray-300">
              <td className="my-5">
                <p className=" mx-10 text-xl text-blue-500">
                    Threefold repetition “offer a” draw
                </p>
              </td>
              <td>
                <p className="mr-5">62</p>
              </td>
              <td className="flex flex-col items-start gap-1 justify-center my-5">
                <p className="text-blue-500">1 hour ago</p>
                <p>by FunnyAnimatorJimTV</p>
              </td>
            </tr>
            <tr>
              <td className="my-5">
                <p className=" mx-10 text-xl text-blue-500">
                    Threefold repetition “offer a” draw
                </p>
              </td>
              <td>
                <p className="mr-5">62</p>
              </td>
              <td className="flex flex-col items-start gap-1 justify-center my-5">
                <p className="text-blue-500">1 hour ago</p>
                <p>by FunnyAnimatorJimTV</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
