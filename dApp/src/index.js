import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './app';

ReactDOM.render(
    <React.StrictMode>
        {/* React.StrictMode : 태그 속 안전하지 않은 생명주기 컴포넌트 발견해줌*/}
        <App/>
    </React.StrictMode>,
    document.getElementById('root')
);
