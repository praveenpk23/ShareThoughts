    import React, { useState,useEffect } from 'react';
    import { useGetUserProfileQuery } from '../../../app/UserApiSLice'
    import {useGetPostLikesQuery,useLikePostMutation,useUnLikePostMutation} from '../../../app/LikeApiSLice'
    const LikeButton = ({ postId }) => {
    const [liked, setLiked] = useState(false);
    const [count, setCount] = useState( 0);
    const {
        data,
        error,
        isLoading,
        refetch: refetchProfile,
    } = useGetUserProfileQuery();
    const {data:likesData,refetch} = useGetPostLikesQuery(postId);
        const [likePost] = useLikePostMutation();
        const [unLike] = useUnLikePostMutation();
    console.log("likesData",likesData);
        useEffect(()=>{
            if(likesData){
                setCount(likesData.totalLikes || 0);
                if(data){
                    const userLiked = likesData.userLiked;
                    setLiked(userLiked);
                }
            }
        },[likesData,data])

    const handleClick = () => {
    if(!data){
        alert("Please login to like the post");
        return;
    }
        setLiked(!liked);
        if (!liked) {
        likePost(postId);
        } else {
        unLike(postId);
        }
        setCount(liked ? count - 1 : count + 1);
    };

    return (
        <button
        onClick={handleClick}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            liked ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        }`}
        >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill={liked ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth={2}
        >
            <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 21C12 21 4 13.5 4 8.5C4 5.42 6.42 3 9.5 3C11.24 3 12.91 3.81 13.5 5.08C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 13.5 15 21 15 21H12Z"
            />
        </svg>
        {count}
        </button>
    );
    };

    export default LikeButton;
