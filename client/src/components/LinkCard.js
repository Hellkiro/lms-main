import React from 'react';

export const LinkCard = ({ link }) => {
    return (
        <>
            <h2>Link</h2>
            <p>Ваша ссылка: <a href={link.to} target="_blank" rel="noopener noreferrer">{link.to}</a></p>
            <p>Откуда: <a href={link.from} target="_blank" rel="noopener noreferrer">{link.from}</a></p>
            <p>Количество кликов по ссылке: <b>{link.clicks}</b></p>
            <p>Дата создания: <b>{new Date(link.date).toLocaleDateString()}</b></p>
        </>
    )
}
    
