import './index.less'

import { useNProgress } from '@tanem/react-nprogress'
import React, { useState } from 'react'
import { useLocation,} from 'react-router-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import Bar from './Bar'
import Container from './Container'

const Progress: React.FC<{ isAnimating: boolean }> = ({ isAnimating }) => {
    const { animationDuration, isFinished, progress } = useNProgress({
        isAnimating,
    })
    return (
        <Container animationDuration={animationDuration} isFinished={isFinished}>
            <Bar animationDuration={animationDuration} progress={progress} />
        </Container>
    )
}

const ProgressProvider = (props: any) => {
    const [isLoading, setIsLoading] = useState(false)
    const location = useLocation()
    return (
        <>
            <Progress isAnimating={isLoading} key={location.key} />
            <TransitionGroup>
                <CSSTransition
                    classNames="fade"
                    key={location.key}
                    onEnter={() => {
                        setIsLoading(true)
                    }}
                    onEntered={() => {
                        setIsLoading(false)
                    }}
                    timeout={1000}
                >
                    {props.children}
                </CSSTransition>
            </TransitionGroup>
        </>
    )
}
export default ProgressProvider;