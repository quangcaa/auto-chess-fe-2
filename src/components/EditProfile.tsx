import React, { useEffect, useState } from 'react';
import useGetMyProfile from '../hooks/useGetMyProfile';
import useEditProfile from '../hooks/useEditProfile';

function EditProfile() {
    const { profile, loading: loadingProfile, error: profileError } = useGetMyProfile();
    const { editProfile, loading: loadingEdit, error: editError, success } = useEditProfile();
    
    const [profileData, setProfileData] = useState({ bio: '', real_name: '', location: '', flag: '' });

    useEffect(() => {
        if (profile) {
            setProfileData({
                bio: profile.bio || '',
                real_name: profile.real_name || '',
                location: profile.location || '',
                flag: profile.flag || '',
            });
        }
    }, [profile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await editProfile(profileData);
    };

    if (loadingProfile) return <p>Loading profile...</p>;
    if (profileError) return <p style={{ color: 'red' }}>{profileError}</p>;

    return (
        <div className="flex flex-col bg-gray-100 p-8 w-full max-w-xl mx-auto">
            <div className="flex flex-col items-center mb-5">
                <p className="text-3xl text-red-500 mb-0">Edit Profile</p>
                <p>All information is public and optional.</p>
            </div>
            <form className="flex flex-wrap justify-between gap-8" onSubmit={handleSubmit}>
                <div className="flex flex-col flex-basis-1/2">
                    <label><b>Biography</b></label>
                    <textarea
                        name="bio"
                        className="bg-gray-300 border-none rounded-md h-16 p-2"
                        value={profileData.bio}
                        onChange={handleChange}
                    />
                    <p className="mt-1">Talk about yourself, your interests, what you like in chess, your favorite openings, players, ...</p>
                </div>
                <div className="flex flex-col flex-basis-1/3">
                    <label><b>Username</b></label>
                    <input
                        type="text"
                        name="username"
                        className="bg-gray-300 border-none rounded-md h-8 p-2"
                        onChange={handleChange}
                        value={profileData.username || ''} // Assuming you have username in profileData
                    />
                </div>
                <div className="flex flex-col flex-basis-1/3">
                    <label><b>Real Name</b></label>
                    <input
                        type="text"
                        name="real_name"
                        className="bg-gray-300 border-none rounded-md h-8 p-2"
                        onChange={handleChange}
                        value={profileData.real_name}
                    />
                </div>
                <div className="flex flex-col flex-basis-1/3">
                    <label><b>Region or Country</b></label>
                    <input
                        type="text"
                        name="region"
                        className="bg-gray-300 border-none rounded-md h-8 p-2"
                        onChange={handleChange}
                        value={profileData.region || ''}
                    />
                </div>
                <div className="flex flex-col flex-basis-1/3">
                    <label><b>Location</b></label>
                    <input
                        type="text"
                        name="location"
                        className="bg-gray-300 border-none rounded-md h-8 p-2"
                        onChange={handleChange}
                        value={profileData.location}
                    />
                </div>
                <div className="flex flex-col mt-6">
                    <hr className="my-2" />
                    <button
                        type="submit"
                        className={`bg-blue-500 text-white rounded-md py-2 px-4 self-end ${loadingEdit ? 'disabled' : ''}`}
                        disabled={loadingEdit}
                    >
                        {loadingEdit ? 'Submitting...' : 'Submit'}
                    </button>
                    {editError && <p style={{ color: 'red' }}>{editError}</p>}
                    {success && <p style={{ color: 'green' }}>Profile updated successfully!</p>}
                </div>
            </form>
        </div>
    );
}

export default EditProfile;
