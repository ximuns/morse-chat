import './Top.css'

import TopGrid from './components/TopGrid/TopGrid'
import TopParticles from './components/TopParticles/TopParticles'
import TopHorizon from './components/TopHorizon/TopHorizon'

function Top() {
    return (
        <div className="top">
            <svg
                className="top__svg"
                viewBox="0 0 1000 1000"
                preserveAspectRatio="none"
                aria-hidden="true"
            >
                <defs>
                    <linearGradient
                        id="topFade"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                    >
                        <stop
                            offset="0%"
                            stopOpacity="0"
                        />

                        <stop
                            offset="18%"
                            stopOpacity="0.05"
                        />

                        <stop
                            offset="50%"
                            stopOpacity="0.35"
                        />

                        <stop
                            offset="100%"
                            stopOpacity="1"
                        />
                    </linearGradient>

                    <mask id="topMask">
                        <rect
                            x="0"
                            y="0"
                            width="1000"
                            height="1000"
                            fill="url(#topFade)"
                        />
                    </mask>

                    <filter
                        id="topGlow"
                        x="-100%"
                        y="-100%"
                        width="300%"
                        height="300%"
                    >
                        <feGaussianBlur
                            stdDeviation="1.5"
                            result="blur"
                        />

                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                <TopGrid />

                <TopParticles />

                <TopHorizon />
            </svg>
        </div>
    )
}

export default Top