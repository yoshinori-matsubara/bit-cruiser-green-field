//npm install react-iconsを実施すると使用できる
import { FaRegListAlt } from "react-icons/fa";
import { AiFillEdit } from "react-icons/ai";
import "./styles/Footer.css";

export default function Footer(props) {
  const { setState } = props;
  const changeMode = (e) => {
    setState(e.currentTarget.value);
  };
  return (
    <footer>
      <button className="footer__button" onClick={changeMode} value="list">
        <FaRegListAlt />
      </button>
      <button className="footer__button" onClick={changeMode} value="regist">
        <AiFillEdit />
      </button>
    </footer>
  );
}
