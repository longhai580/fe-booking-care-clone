import React from 'react';

// custom arrows for react-slick (it passes className/style/onClick)
export const PrevArrow = ({ className, style, onClick }) => (
    <button type="button" className={className} style={style} onClick={onClick} aria-label="Previous">
        <i className="fas fa-chevron-left"></i>
    </button>
);

export const NextArrow = ({ className, style, onClick }) => (
    <button type="button" className={className} style={style} onClick={onClick} aria-label="Next">
        <i className="fas fa-chevron-right"></i>
    </button>
);

export const buildSliderSettings = (slidesToShow = 4) => ({
    dots: false,
    infinite: false,
    speed: 400,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
        { breakpoint: 1100, settings: { slidesToShow: Math.min(3, slidesToShow) } },
        { breakpoint: 768, settings: { slidesToShow: 2 } },
        { breakpoint: 460, settings: { slidesToShow: 1.25 } },
    ],
});
