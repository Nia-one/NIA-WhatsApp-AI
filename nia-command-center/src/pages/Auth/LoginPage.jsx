import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../../services/authService";

export default function LoginPage() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);
            setError("");

            const data = await loginAdmin(
                email,
                password
            );

            localStorage.setItem(
                "nia_token",
                data.token
            );

            localStorage.setItem(
                "nia_user",
                JSON.stringify(data.user)
            );

            navigate("/");

        } catch (err) {

            console.error(err);

            setError(
                err?.response?.data?.message || "Invalid email or password"
            );

        }
        finally {

            setLoading(false);

        }

    };

    // ==========================
    // Debug
    // ==========================
    console.log("Email State:", email);
    console.log("Password State:", password);

    return (

        <div className="min-h-screen flex items-center justify-center bg-slate-100">

            <div className="bg-white p-8 rounded-3xl shadow-lg w-96">

                <h1 className="text-3xl font-bold text-slate-800 text-center">
                    Nia.one
                </h1>

                <p className="text-center text-slate-500 mt-2">
                    Command Center Login
                </p>

                <form
                    onSubmit={handleLogin}
                    autoComplete="off"
                    className="mt-6 space-y-4"
                >

                    <input

                        type="email"

                        name="login_email"

                        autoComplete="off"

                        value={email}

                        onChange={(e)=>setEmail(e.target.value)}

                        placeholder="Email"

                        className="w-full border rounded-xl p-3"

                    />

                    <input

                        type="password"

                        name="login_password"

                        autoComplete="new-password"

                        value={password}

                        onChange={(e)=>setPassword(e.target.value)}

                        placeholder="Password"

                        className="w-full border rounded-xl p-3"

                    />

                    {
                        error &&
                        <p className="text-red-500 text-sm">
                            {error}
                        </p>
                    }

                    <button

                        type="submit"

                        disabled={loading}

                        className="w-full bg-blue-600 text-white rounded-xl p-3"

                    >

                        {
                            loading
                            ?
                            "Logging in..."
                            :
                            "Login"
                        }

                    </button>

                </form>

            </div>

        </div>

    );

}