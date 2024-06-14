import React from 'react';
import { TargetComponent } from './components/TargetComponent';
import "./globals.css";

export default function Page() {
    return <div>
        <TargetComponent></TargetComponent>

        <footer id='footer' style={{ textAlign: "center"}}>
            <p><a href="https://github.com/Veggissss/ElementalGaugeSim">GitHub Repository</a></p>
            <p><a href="https://github.com/Veggissss/ElementalGaugeSim/blob/main/LICENSE">&copy; MIT 2024</a></p>
        </footer>
    </div>;
}