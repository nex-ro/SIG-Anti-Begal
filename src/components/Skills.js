import React from 'react';
import meter1 from "../assets/img/meter1.svg";
import meter2 from "../assets/img/meter2.svg";
import meter3 from "../assets/img/meter3.svg";
import 'react-multi-carousel/lib/styles.css';
import colorSharp from "../assets/img/color-sharp.png";

export const Skills = () => {
  const items = [
    { img: meter1, title: "Fakta 1", desc: "Begal sering menyasar korban yang sedang lengah, seperti menggunakan ponsel di tempat umum." },
    { img: meter2, title: "Fakta 2", desc: "Sebagian besar kasus begal terjadi di daerah dengan penerangan minim pada malam hari." },
    { img: meter3, title: "Fakta 3", desc: "Pelaku begal biasanya beraksi dalam kelompok kecil untuk memperbesar peluang keberhasilan." },
    { img: meter1, title: "Fakta 4", desc: "Menghindari perjalanan sendirian di malam hari dapat mengurangi risiko menjadi korban begal." },
    { img: meter2, title: "Fakta 5", desc: "Polisi menyarankan masyarakat untuk selalu melewati rute yang ramai dan terang saat bepergian." },
    { img: meter3, title: "Fakta 6", desc: "Begal umumnya menggunakan kendaraan roda dua untuk melarikan diri dengan cepat setelah beraksi." },
    { img: meter1, title: "Fakta 7", desc: "Salah satu modus operandi begal adalah berpura-pura mengalami kerusakan kendaraan untuk menjebak korban." },
    { img: meter2, title: "Fakta 8", desc: "Peningkatan CCTV di area rawan begal telah membantu menurunkan angka kejahatan." },
    { img: meter3, title: "Fakta 9", desc: "Membawa alat pertahanan diri yang legal dapat membantu melindungi diri dari ancaman begal." },
    { img: meter1, title: "Fakta 10", desc: "Selalu waspada terhadap kendaraan yang mencurigakan di belakang Anda, terutama di malam hari." },
];


  return (
    <section className="skill" id="skills">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="skill-bx wow fadeIn">
              <h2 className="text-center">Fakta Nyata</h2>
              <p className="text-center">Berikut adalah beberapa fakta mengenai begal yang ada di Pekanbaru <br /> Ini beberapa faktanya yang perlu Anda ketahui:</p>
              <div className="d-flex justify-content-center flex-wrap">
                {items.map((item, index) => (
                  <div className="item mx-3 text-center" key={index} style={{ width: '200px', margin: '20px 0' }}>
                    <img src={item.img} alt={item.title} style={{ width: '100%', borderRadius: '50%' }} />
                    <h5 style={{ marginTop: '10px' }}>{item.title}</h5>
                    <p style={{ fontSize: '14px', color: '#aaa' }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <img className="background-image-left" src={colorSharp} alt="Background Banner" />
    </section>
  );
};
