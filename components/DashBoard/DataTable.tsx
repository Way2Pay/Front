// types.ts or interfaces.ts
export type Transaction = {
  _id: string; // Note the change here
  address: string;
  amount: string;
  buyer: string;
  txHash: string; // New property
};

export type Deployements = {
  chainId: string | number;
  coin: string;
  contract: string | `0x${string}`;
  owner: string | `0x${string}`;
  _id: string;
};

const formatAddress = (address: string) => {
  if(!address) return "ABC"
  if (address?.length <= 6) return address; // Return the original address if it's too short
  return `${address.substring(0, 2)}...${address.substring(
    address.length - 4
  )}`;
};


type DataTableProps = {
  transactions: Transaction[];
  deployedContracts?: Deployements[]; // Make this optional
  onTransactionClick: (transaction: Transaction) => void;
  showDeployedContracts?: boolean; // New prop
};

const DataTable: React.FC<DataTableProps> = ({
  transactions,
  onTransactionClick,
  deployedContracts = [],
  showDeployedContracts = true, // Default value is true
}) => {
  return (
    <>
      <section className="overflow-hidden">
        <div className="items-center w-full px-5 py-24 mx-auto md:px-12 lg:px-16 ">
          <div
            className={`grid items-start ${
              showDeployedContracts
                ? "grid-cols-1 md:grid-cols-2"
                : "grid-cols-1"
            } `}
          >
            <div
              className={`lg:pr-24 md:pr-12 ${
                !showDeployedContracts ? "mx-auto max-w-screen-xl" : ""
              }`} // Conditionally apply max-w-screen-xl class here
            >
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
            {showDeployedContracts && ( // Conditional rendering based on the prop
              <div className="h-full mt-12 lg:mt-0 border-mercury-400 lg:pl-24 md:border-l md:pl-12">
                <div className="text-xl text-center mb-10 font-bold">
                  Deployed Contracts
                </div>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                  {deployedContracts && deployedContracts.length > 0 ? (
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
                        {deployedContracts.map((contract) => (
                          <tr
                            key={contract._id}
                            onClick={() => {}}
                          >
                            <td className="px-6 py-4">
                              {formatAddress(contract._id)}
                            </td>
                            <td className="px-6 py-4">
                              {formatAddress(contract.contract)}
                            </td>
                            <td className="px-6 py-4">{contract.chainId}</td>
                            <td className="px-6 py-4">
                              {formatAddress(contract.owner)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-center p-4">
                      You don&apos;t have any deployments.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};
export default DataTable;
