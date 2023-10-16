import { Transaction } from "./DataTable";

type TransactionModalProps = {
  transaction: Transaction;
  onClose: () => void;
};

const TransactionModal: React.FC<TransactionModalProps> = ({
  transaction,
  onClose,
}) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-1/2 max-w-lg">
        <div className="flex justify-between items-start">
          <h2 className="text-2xl mb-4 font-semibold">Transaction Details</h2>
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-700 transition duration-150"
          >
            ×
          </button>
        </div>
        <div className="mt-4">
          <p className="mb-2">
            <strong className="text-gray-700">ID:</strong> {transaction._id}
          </p>
          <p className="mb-2">
            <strong className="text-gray-700">Address:</strong>{" "}
            {transaction.address}
          </p>
          <p className="mb-2">
            <strong className="text-gray-700">Amount:</strong>{" "}
            {transaction.amount}
          </p>
          <p className="mb-2">
            <strong className="text-gray-700">Buyer:</strong>{" "}
            {transaction.buyer}
          </p>
          <p className="mb-2">
            <strong className="text-gray-700">Transaction Hash:</strong>{" "}
            {transaction.txHash}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
