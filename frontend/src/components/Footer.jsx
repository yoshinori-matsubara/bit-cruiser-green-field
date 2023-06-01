//npm install react-iconsを実施すると使用できる
import { FaRegListAlt } from "react-icons/fa";
import { AiFillEdit } from "react-icons/ai";
// import "./styles/Footer.css";

export default function Footer(props) {
  const { setState } = props;
  const changeMode = (e) => {
    setState(e.currentTarget.id);
  };
  return (
    <footer>
      <div className="footerBrock">
        <FaRegListAlt
          className="footer__button"
          onClick={changeMode}
          id="list"
        />
        <AiFillEdit
          className="footer__button"
          onClick={changeMode}
          id="regist"
        />
      </div>
    </footer>
  );
}
