import React from 'react';
import {motion} from 'framer-motion';

const MeteorEffect: React.FC = () => {
    const meteors = Array.from({length: 50});

    return (
        <div className="absolute inset-0 overflow-hidden">
            {meteors.map((_, index) => (
                <motion.div
                    key={index}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    initial={{opacity: 0}}
                    animate={{x: [0, 100, 200], y: [0, 50, 100], opacity: [0, 1, 0]}}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: Math.random() * 2,
                        ease: "easeInOut"
                    }}
                    style={{
                        left: `${Math.random() * 100}vw`,
                        top: `${Math.random() * 100}vh`,
                    }}
                />
            ))}
        </div>
    );
};

export default MeteorEffect;
