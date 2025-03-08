import SelectorBtn from "../(components)/Button/SelectorBtn";

interface selectBtnProps {
  btnName:string[]
}

export default function Review({btnName}:selectBtnProps){
    return(
      <section>
        <h2>Check Out Real Reviews</h2>
        <SelectorBtn btnName={btnName}/>
      </section>
    )
}