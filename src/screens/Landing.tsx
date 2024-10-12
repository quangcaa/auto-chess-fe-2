import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";


export const Landing = () => {
    const navigate = useNavigate()

    return (
        <div className="flex justify-center">
            <div className="pt-8 max-w-screen-md">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                    </div>
                    <div>
                        <img src={"/favicon.png"} />
                    </div>
                    <div>
                        <div className="mt-4 flex justify-center">
                            <Button onClick={() => { navigate("/game") }}>
                                CREATE A GAME
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
