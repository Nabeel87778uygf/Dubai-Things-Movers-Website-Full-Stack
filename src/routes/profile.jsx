import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import axios from "axios";

export const Route = createFileRoute("/profile")({
    component: Profile,
});

function Profile() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await axios.get(
                    "http://localhost:5000/api/auth/profile",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setUser(res.data.user);
            } catch (err) {
                console.log(err);
            }
        };

        fetchProfile();
    }, []);

    if (!user) {
        return <h2>Loading profile...</h2>;
    }

    return (
        <div style={{ padding: "20px" }}>
            <h1>👤 Profile Page</h1>

            <p><b>Name:</b> {user.fullName}</p>
            <p><b>Email:</b> {user.email}</p>
        </div>
    );
}