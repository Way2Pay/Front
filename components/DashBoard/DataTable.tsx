// types.ts or interfaces.ts
export type Transaction = {
  _id: string; // Note the change here
  address: string;
  amount: string;
  buyer: string;
  txHash: string; // New property
};

const formatAddress = (address: string) => {
  if (address.length <= 6) return address; // Return the original address if it's too short
  return `${address.substring(0, 2)}...${address.substring(
    address.length - 4
  )}`;
};

type DataTableProps = {
  transactions: Transaction[];
  onTransactionClick: (transaction: Transaction) => void;
};

const DataTable: React.FC<DataTableProps> = ({
  transactions,
  onTransactionClick,
}) => {
  return (
    <>
      <section className="overflow-hidden">
        <div className="items-center w-full px-5 py-24 mx-auto md:px-12 lg:px-16 ">
          <div className="grid items-start grid-cols-1 md:grid-cols-2">
            <div className="lg:pr-24 md:pr-12">
              <div className="text-xl text-center mb-10 font-bold">
                All Transactions
              </div>
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        ID
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Address
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Buyer
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr
                        key={transaction._id}
                        className="cursor-pointer hover:bg-gray-100"
                        onClick={() => onTransactionClick(transaction)}
                      >
                        <td className="px-6 py-4">
                          {formatAddress(transaction._id)}
                        </td>
                        <td className="px-6 py-4">
                          {formatAddress(transaction.address)}
                        </td>
                        <td className="px-6 py-4">{transaction.amount}</td>
                        <td className="px-6 py-4">
                          {formatAddress(transaction.buyer)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="h-full mt-12 lg:mt-0 border-mercury-400 lg:pl-24 md:border-l md:pl-12">
              <div className="text-xl text-center mb-10 font-bold">
                All Transactions
              </div>
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        TRXID
                      </th>
                      <th scope="col" className="px-6 py-3">
                        COINS
                      </th>
                      <th scope="col" className="px-6 py-3">
                        VALUE
                      </th>
                      <th scope="col" className="px-6 py-3">
                        DATE
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* You can add the second table's data mapping here */}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default DataTable;
