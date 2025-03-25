import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";


type StarIconProps = {
  className?: string;
};

export default function StarIcon({ className }: StarIconProps) {
  return <FontAwesomeIcon icon={faStar} style={{ fontSize: '20px' }} className={className} />;
}
