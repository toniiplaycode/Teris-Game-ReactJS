import { useCallback, useEffect, useState } from "react"

export const useGameStatus = (rowsClear) => {
    const [score, setScore] = useState(0);
    const [rows, setRows] = useState(0);
    const [level, setLevel] = useState(1);
    
    const linePoints = [40, 100, 300, 1200];

    const calcScore = useCallback(() => {
        if (rowsClear > 0) {
            setScore(prev => prev + linePoints[rowsClear - 1] * level);
            setRows(prev => prev + rowsClear);
        }
    }, [level, linePoints, rowsClear]);

    useEffect(() => {
        calcScore();
    }, [calcScore, rowsClear, score]);

    // tính useCallback kết hợp useEffect để trách re-render lại (tính sai điểm)

    return [score, setScore, rows, setRows, level, setLevel];
} 