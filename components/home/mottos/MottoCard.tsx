import { motion } from "framer-motion";

interface Props {
  borderolor?: string;
  title: string;
  shadowColor?: string;
  delay?: number;
}

function MottoCard(props: Props) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {
          scale: 0.8,
          opacity: 0,
        },
        visible: {
          scale: 1,
          opacity: 1,
          transition: {
            delay: props.delay,
          },
        },
      }}
    >
      <div className="my-5 font-bold flex items-center justify-center w-[60%] container h-10  bg-white rounded-full shadow-lg  shadow-[#0ba] text-[#2c3e50] ">
        {props.title}
      </div>
    </motion.div>
  );
}

export default MottoCard;
