


import { motion } from 'framer-motion';
import { Search, Car, Calendar, ArrowRight, Shield, Clock, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import ParkingCard from '../components/ParkingCard';
import SearchBar from '../components/SearchBar';
import { useAppSelector, useAppDispatch } from '../redux/hook';
import { setSearchCity } from '../redux/slices/parkingSlice';
import StaggerContainer, { StaggerItem } from '../components/StaggerContainer';
import { useState } from 'react';

export default function HomePage() {
  const { parkings } = useAppSelector(s => s.parking);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? steps.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === steps.length - 1 ? 0 : prev + 1));
  };
  const handleSearch = (query) => {
    dispatch(setSearchCity(query));
    navigate('/user/dashboard');
  };

  const steps = [
    { icon: Search, title: 'Search Parking', desc: 'Find parking spots near your destination by city or location.' },
    { icon: Calendar, title: 'Book a Slot', desc: 'Choose your preferred slot, date and time to reserve your spot.' },
    { icon: Car, title: 'Park Vehicle', desc: 'Navigate to the parking, park your vehicle in the assigned slot.' },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 min-h-screen">

      {/* HERO */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.15),transparent_50%)]" />

        <div className="container mx-auto px-4 relative text-center max-w-4xl">

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight"
          >
            Find Parking <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              Anywhere
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-lg text-gray-600 max-w-xl mx-auto"
          >
            Book parking spaces in seconds. From malls to offices, find the perfect spot for your vehicle.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 max-w-lg mx-auto"
          >
            <SearchBar onSearch={handleSearch} />
          </motion.div>

          <div className="flex justify-center gap-6 mt-8 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Shield className="w-4 h-4 text-green-500" /> Secure
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-blue-500" /> 24/7
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500" /> Rated
            </span>
          </div>
        </div>
      </section>

      {/* NEARBY PARKING */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">

          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Nearby Parking Spaces
            </h2>
            <p className="text-gray-600 mt-2">
              Explore top-rated parking spots near you
            </p>
          </div>

          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {parkings.slice(0, 6).map(p => (
              <StaggerItem key={p.id}>
                <div className="backdrop-blur-lg bg-white/60 border border-white/30 rounded-2xl shadow-lg hover:shadow-xl transition">
                  <ParkingCard parking={p} />
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

        </div>
      </section>

      {/* HOW IT WORKS */}
      {/* <section className="py-16 lg:py-24 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 text-center">

          <h2 className="text-3xl font-bold text-gray-900 mb-10">
            How It Works
          </h2>

          <StaggerContainer className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, i) => (
              <StaggerItem key={i}>
                <div className="backdrop-blur-lg bg-white/70 border border-white/30 rounded-2xl p-6 shadow-md hover:shadow-xl transition">

                  <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-xl bg-blue-100 mb-4">
                    <step.icon className="w-6 h-6 text-blue-600" />
                  </div>

                  <p className="text-sm text-blue-500 font-semibold">
                    Step {i + 1}
                  </p>

                  <h3 className="font-semibold text-lg mt-2">
                    {step.title}
                  </h3>

                  <p className="text-gray-600 text-sm mt-2">
                    {step.desc}
                  </p>

                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

        </div>
      </section> */}



 
    <section className="py-16 lg:py-24 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-10">How It Works</h2>

        <div className="relative max-w-3xl mx-auto overflow-hidden">
          {/* Carousel wrapper */}
          <motion.div
            className="flex transition-transform duration-500"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {steps.map((step, i) => (
              <div
                key={i}
                className="min-w-full p-6 flex flex-col items-center justify-center backdrop-blur-lg bg-white/70 border border-white/30 rounded-2xl shadow-md hover:shadow-xl transition"
              >
                <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-blue-100 mb-4">
                  <step.icon className="w-6 h-6 text-blue-600" />
                </div>

                <p className="text-sm text-blue-500 font-semibold">Step {i + 1}</p>
                <h3 className="font-semibold text-lg mt-2">{step.title}</h3>
                <p className="text-gray-600 text-sm mt-2">{step.desc}</p>
              </div>
            ))}
          </motion.div>

          {/* Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full shadow hover:bg-white"
          >
            <ChevronLeft className="w-6 h-6 text-blue-600" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full shadow hover:bg-white"
          >
            <ChevronRight className="w-6 h-6 text-blue-600" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center mt-6 space-x-2">
          {steps.map((_, i) => (
            <button
              key={i}
              className={`w-3 h-3 rounded-full ${
                i === currentIndex ? "bg-blue-600" : "bg-gray-300"
              }`}
              onClick={() => setCurrentIndex(i)}
            />
          ))}
        </div>
      </div>
    </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">

          <div className="backdrop-blur-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/30 rounded-3xl p-10 shadow-xl max-w-3xl mx-auto">

            <h2 className="text-3xl font-bold text-gray-900">
              Have a Parking Space?
            </h2>

            <p className="text-gray-600 mt-3">
              List your parking space and start earning today.
            </p>

            <Link to="/register">
              <Button className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:scale-105 transition">
                Become a Provider
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>

          </div>

        </div>
      </section>

    </div>
  );
}

