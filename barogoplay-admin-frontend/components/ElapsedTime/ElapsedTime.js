import { useState, useEffect } from 'react';
export default function ElapsedTime({ createdDate }) {
    // elapsedTime('2023-08-09T16:13:05.123Z') 기준 시간

    //현재시간
    const [today, setToday] = useState(null);

    useEffect(() => {
        setToday(new Date());
    }, []);

    //작성시간 
    var writeDay = new Date(createdDate);
    const betweenTime = today !== null && Math.floor((today.getTime() - writeDay.getTime()) / 1000 / 60);

    if (betweenTime < 1) return '방금 전';
    if (betweenTime < 60) return betweenTime + '분 전';
    const betweenTimeHour = Math.floor(betweenTime / 60);
    if (betweenTimeHour < 24) return betweenTimeHour + '시간 전';
    const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
    if (betweenTimeDay <= 7) return betweenTimeDay + '일 전';
    if (betweenTimeDay > 7) return createdDate.replace(/-/gi, '.').split('T')[0];

}