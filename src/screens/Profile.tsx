import bulletImage from "./../assets/images/bullet.png";
import blitzImage from "./../assets/images/blitz.png";
import rapidImage from "./../assets/images/rapid.png";
import classicalImage from "./../assets/images/classical.png";
import dailyImage from "./../assets/images/daily.png";
import puzzlesImage from "./../assets/images/puzzles.png";
import stateImage from "./../assets/images/state.png";
import profile_navImage from "./../assets/images/profile_nav.png";
import barlineImage from "./../assets/images/barline.png";
import battle_exampleImage from "./../assets/images/battle_example.png";

function Profile() {
    return (
        <div className="flex flex-row justify-center bg-gray-200 gap-2 h-screen">
            <div className="bg-white p-4 w-1/4">
                <ul className="list-none">
                    {[
                        {
                            img: bulletImage,
                            title: "BULLET",
                            rating: "3117",
                            games: "46,498 games",
                        },
                        {
                            img: blitzImage,
                            title: "BLITZ",
                            rating: "2755",
                            games: "4,856 games",
                        },
                        {
                            img: rapidImage,
                            title: "RAPID",
                            rating: "2672",
                            games: "237 games",
                        },
                        {
                            img: classicalImage,
                            title: "CLASSICAL",
                            rating: "?",
                            games: "6 games",
                        },
                        { img: dailyImage, title: "DAILY", rating: "?", games: "12 games" },
                        {
                            img: puzzlesImage,
                            title: "PUZZLES",
                            rating: "2652",
                            games: "2,933 games",
                        },
                    ].map((item, index) => (
                        <li key={index} className="flex items-center mb-2">
                            <img src={item.img} alt={item.title} className="w-12 h-12" />
                            <div className="ml-2">
                                <p>{item.title}</p>
                                <p>
                                    <b>{item.rating}</b> {item.games}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="flex flex-col w-3/4 bg-white p-4">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                        <img src={stateImage} alt="state" className="w-5 h-4" />
                        <p className="pl-2">penguingim1</p>
                    </div>
                    <img src={profile_navImage} alt="profile-nav" className="w-5 h-4" />
                </div>
                <div className="flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <img
                            src={barlineImage}
                            alt="barline"
                            className="w-[400px] object-contain"
                        />
                        <hr className="border-black mx-2" />
                        <div className="w-1/3">
                            <p>
                                <b>Andrew Tang</b>
                                <br />
                                <i>
                                    suddenly, the champion returns with initiative and vengeance.
                                </i>
                            </p>
                            <p>New York, NY</p>
                            <p>Member since Apr 21, 2015</p>
                            <p>Active 15 hours ago</p>
                            <p>Time spent playing: 90 days 17 hours 11 minutes</p>
                        </div>
                    </div>
                    <hr className="border-black mb-4" />
                    <div className="flex flex-col items-center">
                        <div className="flex justify-between w-full mb-4">
                            {[
                                { label: "Games", count: "372,329" },
                                { label: "Rated", count: "102,221" },
                                { label: "Wins", count: "239,231" },
                                { label: "Losses", count: "123,098" },
                                { label: "Draws", count: "10,000" },
                            ].map((item, index) => (
                                <div key={index} className="flex flex-col items-center">
                                    <p>{item.count}</p>
                                    <p>{item.label}</p>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between items-start gap-4 mb-4">
                            <img
                                src={battle_exampleImage}
                                alt="battle-example"
                                className="w-24 object-contain"
                            />
                            <div className="flex flex-col flex-grow">
                                <p>1/4+0 | ULTRABULLET | RATED</p>
                                <div className="flex justify-between items-center">
                                    <div className="flex flex-col items-center">
                                        <p>Adolf Hitler</p>
                                        <p>2601 + 3</p>
                                    </div>
                                    <h3>VS</h3>
                                    <div className="flex flex-col items-center">
                                        <p>Stalin</p>
                                        <p>2464 - 4</p>
                                    </div>
                                </div>
                                <p>Nf3 e6 2. d3 d5 3.Nbd2 Be7 ... 65 moves</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
