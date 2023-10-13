import { Variants } from "framer-motion";

const transition = {
  duration: 0.5,
  delay: 0.2,
  ease: "easeOut",
};

const spring = {
  type: "spring",
  damping: 20,
  stiffness: 100,
};

export const slideRight: Variants = {
  hidden: { x: "-40%", opacity: 0 },
  visible: { x: "0%", opacity: 1, transition },
  exit: { x: "-100%", opacity: 0, transition: { ...transition, delay: 0 } },
};

export const slideLeft: Variants = {
  hidden: { x: "40%", opacity: 0 },
  visible: { x: "0%", opacity: 1, transition },
  exit: { x: "100%", opacity: 0, transition: { ...transition, delay: 0 } },
};

export const slideDown: Variants = {
  hidden: { y: "-40%", opacity: 0 },
  visible: { y: "0%", opacity: 1, transition },
  exit: { y: "-100%", opacity: 0, transition: { ...transition, delay: 0 } },
};

export const slideUp: Variants = {
  hidden: { y: "40%", opacity: 0 },
  visible: { y: "0%", opacity: 1, transition },
  exit: { y: "100%", opacity: 0, transition: { ...transition, delay: 0 } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition },
  exit: { opacity: 0, scale: 0.95, transition: { ...transition, delay: 0 } },
};

export const scaleUp: Variants = {
  hidden: { scale: 0.7, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: spring },
  exit: { scale: 0.7, opacity: 0, transition: spring },
};

// ... add more presets as needed
