import { Container, Row, Col, Tab, Nav } from "react-bootstrap";
import { ProjectCard } from "./ProjectCard";
import projImg1 from "../assets/img/project-img1.jpg";
import projImg2 from "../assets/img/project-img2.jpg";
import projImg3 from "../assets/img/project-img3.jpg";
import projImg4 from "../assets/img/project-img4.jpg";
import projImg5 from "../assets/img/project-img5.jpg";
import projImg6 from "../assets/img/project-img6.jpg";
import colorSharp2 from "../assets/img/color-sharp2.png";
import 'animate.css';
import TrackVisibility from 'react-on-screen';

export const Projects = () => {

  const projects = [
    {
      title: "4 orang begal di pekanbaru",
      description: "Beberapa orang yang telah melakukan pembegalan terhadap pengendara motor yang ada di pekanbaru",
      imgUrl: projImg6,
    },
    {
      title: "Hukuman 4 tahun penjara",
      description: "Pihak polisi melakukan vonis hukum terhadap begal max 4 tahun penjara",
      imgUrl: projImg2,
    },
    {
      title: "WASPADA! Orang dijalanan lebih sering menjadi target begal",
      description: "Pihak polisi menghimbau kepada pengendara motor ataupun pejalan kaki agar lebih berhati hati untuk upaya menghindari pelaku begal",
      imgUrl: projImg3,
    },
    {
      title: "12 Orang tersangka melakukan pembegalan didaerah marpoyan",
      description: "Polisi berhasil menangkap 12 orang tersangka pembegalan didaerah marpoyan",
      imgUrl: projImg4,
    },
    {
      title: "2 Tersangka Ditangkap!",
      description: "Pembegalan ini dilakukan di jalanan oleh sepasang sekasih dan kini telah diamankan polisi",
      imgUrl: projImg5,
    },
    {
      title: "INFO PEKANBARU!!!",
      description: "Polisi berhasil mengamankan pelaku begal yang ada disekitar daerah hangtuah tenayan raya",
      imgUrl: projImg1,
    },
  ];

  return (
    <section className="project" id="projects">
      <Container>
        <Row>
          <Col size={12}>
            <TrackVisibility>
              {({ isVisible }) =>
              <div className={isVisible ? "animate__animated animate__fadeIn": ""}>
                <h2>Informasi Begal</h2>
                <p>Beberapa Informasi terkait begal yang terjadi sekitaran pekanbaru</p>
                <Tab.Container id="projects-tabs" defaultActiveKey="first">
                  <Nav variant="pills" className="nav-pills mb-5 justify-content-center align-items-center" id="pills-tab">
                    <Nav.Item>
                      <Nav.Link eventKey="first">Tab 1</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="second">Tab 2</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="third">Tab 3</Nav.Link>
                    </Nav.Item>
                  </Nav>
                  <Tab.Content id="slideInUp" className={isVisible ? "animate__animated animate__slideInUp" : ""}>
                    <Tab.Pane eventKey="first">
                      <Row>
                        {
                          projects.map((project, index) => {
                            return (
                              <ProjectCard
                                key={index}
                                {...project}
                                />
                            )
                          })
                        }
                      </Row>
                    </Tab.Pane>
                    <Tab.Pane eventKey="second">
                    <Row>
                        {
                          projects.map((project, index) => {
                            return (
                              <ProjectCard
                                key={index}
                                {...project}
                                />
                            )
                          })
                        }
                      </Row>
                    </Tab.Pane>
                    <Tab.Pane eventKey="third">
                    <Row>
                        {
                          projects.map((project, index) => {
                            return (
                              <ProjectCard
                                key={index}
                                {...project}
                                />
                            )
                          })
                        }
                      </Row>
                    </Tab.Pane>
                  </Tab.Content>
                </Tab.Container>
              </div>}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
      <img className="background-image-right" src={colorSharp2} alt="Background Banner 2"></img>
    </section>
  )
}
