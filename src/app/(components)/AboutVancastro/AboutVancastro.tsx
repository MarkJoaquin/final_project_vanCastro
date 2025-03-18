type Props = {
    title: string;
    subtitle: string;
};

interface AboutVancastroProps {
    data: Props;
}

export default function AboutVancastro({data}: AboutVancastroProps) {
    const { title, subtitle } = data;

    return (
        <div className="aboutVancastro">
            
        </div>
    )
}