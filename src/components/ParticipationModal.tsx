interface ParticipationModalProps {
   onClose: (status: string) => void;
 }
 
 const ParticipationModal: React.FC<ParticipationModalProps> = ({ onClose }) => {
   return (
     <div className="absolute top-full mt-[5px] bg-white border border-[#DEDEDE] rounded-[8px] shadow-md z-10 w-[180px]">
       <div className="p-2 cursor-pointer hover:bg-gray-200" onClick={() => onClose('Open for Participation')}>
         Open for Participation
       </div>
       <div className="p-2 cursor-pointer hover:bg-gray-200" onClick={() => onClose('Participation Closed')}>
         Participation Closed
       </div>
     </div>
   );
 };
 
 export default ParticipationModal;
 