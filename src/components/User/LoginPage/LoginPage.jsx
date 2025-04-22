import React from 'react';
import { motion } from 'framer-motion';

const Card = () => {
    return (
        <motion.div 
            className="card-container"
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ width: '300px', margin: '20px', borderRadius: '15px', overflow: 'hidden' }}
        >
            <motion.div 
                className="card-header"
                initial={{ y: -50 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                    backgroundColor: '#4CAF50', 
                    padding: '15px', 
                    textAlign: 'center', 
                    color: '#fff', 
                    fontSize: '20px', 
                    fontWeight: 'bold'
                }}
            >
                Card Title
            </motion.div>

            <motion.div 
                className="card-body"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                style={{
                    padding: '20px', 
                    backgroundColor: '#fff', 
                    textAlign: 'center', 
                    color: '#333'
                }}
            >
                <p>
                    This is a professional card with smooth animations and a modern look. 
                    It uses Framer Motion for interactive animations.
                </p>
            </motion.div>

            <motion.div 
                className="card-footer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                style={{
                    padding: '10px', 
                    backgroundColor: '#f1f1f1', 
                    textAlign: 'center', 
                    color: '#888',
                    borderTop: '1px solid #ddd'
                }}
            >
                <button
                    style={{
                        backgroundColor: '#4CAF50',
                        color: '#fff',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '16px',
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Click Me
                </button>
            </motion.div>
        </motion.div>
    );
};

export default Card;
