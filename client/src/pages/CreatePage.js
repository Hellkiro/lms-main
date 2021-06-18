import React, { useState, useContext } from 'react';
import {AuthContext} from '../context/AuthContext';
import {useHistory} from 'react-router-dom';
import {useHttp} from '../hooks/http.hook';

export const CreatePage = () => {
    const history = useHistory();
    const auth = useContext(AuthContext);
    const {request} = useHttp();
    const [link, setLink] = useState('');
    const pressHandler = async (event) => {
        if (event.key === 'Enter') {
            try {
                const data = await request('/api/link/generate', 'POST', { from: link }, {
                    Authorization: 'Bearer ' + auth.token
                });
                history.push('/detail/' + data.link._id);
            } catch (error) {}
        }
    }
    return(
        <div className="row">
            <div className="col s8 offset-s2">
                <div className="input-field">
                    <input
                        className="validate white-text"
                        placeholder="paste link"
                        id="link"
                        type="text"
                        value={link}
                        onChange={e => setLink(e.target.value)}
                        onKeyPress={pressHandler}
                    />
                    <label htmlFor="link">Paste link</label>
                </div>
            </div>            
        </div>
    )
}