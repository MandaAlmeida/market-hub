import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import type { Ads } from "../pages/marketplace";


type Props = {
    getImageUrl: (fileName: string) => string
    ads: Ads
}

const AdImageSlider = ({ ads, getImageUrl }: Props) => {
    if (!ads.image || ads.image.length === 0) return null;

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    return (
        <Slider {...settings} className="mb-4 rounded-md overflow-hidden">
            {ads.image.map((img, index) => (
                <img
                    key={index}
                    src={getImageUrl(img.url)}
                    alt={ads.title}
                    className="h-48 w-full object-cover"
                />
            ))}
        </Slider>
    );
};


export default AdImageSlider;