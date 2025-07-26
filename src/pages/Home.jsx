import React from "react"
import Description from "../components/Description"
import GenerateBtn from "../components/GenerateBtn"
import Header from "../components/Header"
import Steps from "../components/Steps"
import Testimonials from "../components/Testimonials"
import Footer from "../components/Footer"

const Home = () => {
  return (
    <div>
      <Header/>
      <Steps/>
      <Description/>
      <Testimonials/>
      <GenerateBtn/>
    </div>
  )
}

export default Home
