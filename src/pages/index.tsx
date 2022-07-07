import yayJpg from '../assets/yay.jpg';
import {Button} from 'antd';

export default function HomePage() {
    return (
        <div>
            <h2>Yay! Welcome to umi!</h2>
            <p>
                <img src={yayJpg} width="388"/>
            </p>
            <p>
                To get started, edit <code>pages/index.tsx</code> and save to reload.
            </p>
            <p>
                <Button type="primary">这是antd按钮</Button>
            </p>
            <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
                <div className="flex-shrink-0">
                    <img className="h-12 w-12" src="/img/logo.svg" alt="ChitChat Logo"/>
                </div>
                <div>
                    <div className="text-xl font-medium text-black">ChitChat</div>
                    <p className="text-gray-500">You have a new message!</p>
                </div>
            </div>
        </div>
    );
}
