import React, {useEffect, useState, useRef} from "react";
import './App.css';
import axios from "axios";
import {BrowserView, MobileView} from "react-device-detect";

function App() {
    const [userId, setUserId] = useState(''); // State to hold the user ID
    const [theme, setTheme] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) return;

        const abortController = new AbortController();
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get(`https://march8.onrender.com/?${userId}`, {
                    headers: { accept: 'application/json' },
                    signal: abortController.signal,
                });
                setData(response.data);
            } catch (error) {
                if (!abortController.signal.aborted) {
                    console.error("There was an error fetching the data", error);
                    setError("Failed to fetch data. Please try again.");
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();

        return () => abortController.abort(); // Cleanup on unmount
    }, [userId]);
    const createHeart = () => {
        const container = document.querySelector('.clouds');
        const cloud1Rect = document.querySelector('.cloud-1').getBoundingClientRect();
        const cloud2Rect = document.querySelector('.cloud-2').getBoundingClientRect();
        const cloudTop = 100;
        const cloud1Width = cloud1Rect.width - 100;
        const cloud2Width = cloud2Rect.width - 100;

        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.innerHTML = "&#x2665;";
        heart.style.left = `${Math.random() * (cloud1Width + cloud2Width + 10) + 160}px`;
        heart.style.top = `${cloudTop}px`;
        heart.style.animationDelay = `${Math.random()}s`;
        container.appendChild(heart);
    };

    // Effect for handling heart creation on mouse enter/leave
    useEffect(() => {
        const clouds = document.querySelector('.clouds');
        let heartInterval;

        const handleMouseEnter = () => {
            heartInterval = setInterval(createHeart, 700);
        };

        const handleMouseLeave = () => {
            clearInterval(heartInterval);
        };

        clouds.addEventListener('mouseenter', handleMouseEnter);
        clouds.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            clouds.removeEventListener('mouseenter', handleMouseEnter);
            clouds.removeEventListener('mouseleave', handleMouseLeave);
            clearInterval(heartInterval);
        };
    }, []);

    // Toggle play state
    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    // useEffect(() => {
    //     const audio = document.getElementById('audio');
    //     const cdContainer = document.getElementById('cdContainer');
    //     if (isPlaying) {
    //         cdContainer.style.animationPlayState = 'running';
    //         audio.play();
    //     } else {
    //         cdContainer.style.animationPlayState = 'paused';
    //         audio.pause();
    //     }
    // }, [isPlaying]);
    return (
        <>
            {theme ? (
                <>
                    <BrowserView>
                        <div className="container">
                            <img src="/img/8.png" alt="" className="desktop-8" />
                            <img src="/img/MARCH.png" alt="" className="desktop-march" />
                            <a onClick={() => setTheme(false)}>
                                <img src="/img/postcard.png" alt="Postcard" className="postcard" />
                            </a>
                            <img src="/img/bird.gif" alt="Bird" className="bird" id="bird-1" />
                            <img src="/img/bird.gif" alt="Bird" className="bird" id="bird-2" />
                            <div className="clouds">
                                <img src="/img/cloud.png" alt="Cloud" className="cloud-1" />
                                <img src="/img/cloud.png" alt="Cloud" className="cloud-2" />
                            </div>
                            <div className="grasses">
                                <img src="/img/grass.png" alt="Grass" className="grass" />
                            </div>
                            <div className="music">
                                <div className="cd-container" id="cdContainer">
                                    <div className="cd"></div>
                                </div>
                                {/* Correctly closed the comment and removed the space before the closing tag */}
                                {/* <audio id="audio" src="/audio/Powfu - death bed (coffee for your head)(feat. beabadoobee).mp3" controls hidden></audio> */}
                            </div>
                        </div>
                    </BrowserView>
                    <MobileView>
                        <div className="container-phone">
                            {/* Fixed the path for the images to start with a slash for consistency */}
                            <img src="/img/phone-8.png" alt="" className="phone-8" />
                            <img src="/img/MARCH.png" alt="" className="phone-march" />
                            <img src="/img/grass.png" alt="" className="grass-phone" />
                            <button onClick={() => setTheme(false)} className="postcard-button">
                                <img src="/img/postcard.png" alt="Postcard" className="postcard-phone" />
                            </button>
                            {/* Assuming CloudComponent is a correctly defined React component */}
                            <CloudComponent />
                            <img src="/img/bird.gif" alt="" className="bird-phone" id="bird-1-phone" />
                            <img src="/img/bird.gif" alt="" className="bird-phone" id="bird-2-phone" />
                        </div>
                    </MobileView>
                </>
            ) : (
                <>
                    <BrowserView>
                        <div className="container">
                            <div className="texts">
                                <p className="text">HAPPY WOMEN’S DAY</p>
                                <p className="text">{data?.text}</p>
                                <p className="text" id="wishes-text">{data?.congregation_text}</p>
                            </div>
                            <img src="/img/heart1.png" alt="Heart" className="heart1" />
                            <img src="/img/heart2.png" alt="Heart" className="heart2" />
                            <div className="clouds-pink">
                                <img src="/img/clouds-pink.png" alt="Pink Cloud" className="cloud-pink" />
                                <img src="/img/clouds-pink.png" alt="Pink Cloud" className="cloud-pink" style={{ transform: "translateX(-1px)" }} />
                            </div>
                            <img src="/img/music-note.png" alt="Music Note" className="music-note" />
                            <audio autoPlay loop>
                                <source src={data?.music} type="audio/mp3" />
                            </audio>
                            <img src="/img/photo-album.png" alt="Photo Album" className="photo-album" />
                            <div className="pngs">
                                <img src={data?.img1} alt="Person 1" className="png1" />
                                <img src={data?.img2} alt="Person 2" className="png2" />
                                <img src={data?.img3} alt="Person 3" className="png3" />
                            </div>
                        </div>
                    </BrowserView>
                    <MobileView>
                        <div className="container-phone">
                            <div className="texts-phone">
                                <p className="text-phone">HAPPY WOMEN’S DAY</p>
                                <p className="text-phone">Zhanym</p>
                            </div>
                            <img src="/img/heart1.png" alt="" className="heart1-phone" />
                            <img src="/img/heart2.png" alt="" className="heart2-phone" />
                            <div className="clouds-pink-phone">
                                <img src="/img/clouds-pink.png" alt="" className="cloud-pink-phone" />
                                <img src="/img/clouds-pink.png" alt="" className="cloud-pink-phone" />
                            </div>
                            <div className="notes-phone">
                                <img src="/img/music-note.png" alt="" className="music-note-phone" />
                            </div>
                        </div>
                        <div className="pngs-phone">
                            <img src="/img/photo-album.png" alt="" className="photo-album-phone" />
                            <div className="photos-phone">
                                <img src="/people/IMG_6782.jpg" ALT="" className="png1-phone" />
                                <img src="/people/IMG_9992.jpg" ALT="" className="png2-phone" />
                                <img src="/people/IMG_1641.JPG" ALT="" className="png3-phone" />
                            </div>
                        </div>
                    </MobileView>
                </>
            )}
        </>
    );
}

function CloudComponent() {
    // State to manage active hearts
    const [hearts, setHearts] = useState([]);

    // Refs for clouds to attach event listeners directly
    const cloudsRef = useRef([]);

    useEffect(() => {
        // Function to check if mouse is inside cloud
        const isMouseInsideCloud = (event, cloud) => {
            const cloudRect = cloud.getBoundingClientRect();
            return (
                event.clientX >= cloudRect.left &&
                event.clientX <= cloudRect.right &&
                event.clientY >= cloudRect.top &&
                event.clientY <= cloudRect.bottom
            );
        };

        // Function to create heart
        const createHeart = (cloud) => {
            const newHeart = {
                id: Date.now(),
                top: cloud.offsetTop + cloud.clientHeight,
                left: getRandomLeft(cloud),
            };
            setHearts((currentHearts) => [...currentHearts, newHeart]);
        };

        // Function to generate random left position for heart
        const getRandomLeft = (cloud) => {
            const minLeft = cloud.offsetLeft;
            const maxLeft = cloud.offsetLeft + cloud.clientWidth;
            return Math.floor(Math.random() * (maxLeft - minLeft + 1)) + minLeft;
        };

        // Function to drop hearts
        const dropHearts = (cloud, count) => {
            let delay = 0;
            for (let i = 0; i < count; i++) {
                setTimeout(() => {
                    createHeart(cloud);
                }, delay);
                delay += 1000; // Adjust the delay (in milliseconds) between each heart drop
            }
        };

        // Attach event listeners
        cloudsRef.current.forEach((cloud) => {
            let isMouseDown = false;

            const handleMouseDown = () => {
                isMouseDown = true;
                cloud.classList.add('shaking');
                dropHearts(cloud, 10); // Drop 10 hearts when the cloud is clicked and held down
            };

            const handleMouseUp = () => {
                isMouseDown = false;
                cloud.classList.remove('shaking');
            };

            const handleMouseMove = (event) => {
                if (isMouseDown && !isMouseInsideCloud(event, cloud)) {
                    isMouseDown = false;
                    cloud.classList.remove('shaking');
                }
            };

            // Add event listeners for mouse
            cloud.addEventListener('mousedown', handleMouseDown);
            cloud.addEventListener('mouseup', handleMouseUp);
            cloud.addEventListener('mousemove', handleMouseMove);

            // Add event listeners for touch
            cloud.addEventListener('touchstart', handleMouseDown);
            cloud.addEventListener('touchend', handleMouseUp);

            return () => {
                // Clean up event listeners
                cloud.removeEventListener('mousedown', handleMouseDown);
                cloud.removeEventListener('mouseup', handleMouseUp);
                cloud.removeEventListener('mousemove', handleMouseMove);
                cloud.removeEventListener('touchstart', handleMouseDown);
                cloud.removeEventListener('touchend', handleMouseUp);
            };
        });
    }, []);

    return (
        <>
            <div ref={(el) => (cloudsRef.current[0] = el)} className="cloud">Cloud 1</div>
            <div ref={(el) => (cloudsRef.current[1] = el)} className="cloud">Cloud 2</div>
            {/* Render hearts */}
            {hearts.map((heart) => (
                <div key={heart.id} className="heart-phone" style={{ position: 'absolute', top: heart.top, left: heart.left }}>
                    ♥
                </div>
            ))}
        </>
    );
}


export default App;
