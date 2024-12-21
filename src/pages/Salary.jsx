// src/pages/Salary.jsx
import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, DollarSign, Calendar, User } from 'lucide-react';

function Salary() {
  // State management for salary records
  const [salaries, setSalaries] = useState([{
    id: 1,
    employeeName: 'John Smith',
    position: 'Software Developer',
    basicSalary: 5000,
    bonus: 1000,
    deductions: 500,
    netSalary: 5500,
    paymentDate: '2024-01-01',
    status: 'Paid'
  }]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSalary, setCurrentSalary] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    employeeName: '',
    position: '',
    basicSalary: 0,
    bonus: 0,
    deductions: 0,
    paymentDate: '',
    status: 'Pending'
  });

  // Calculate net salary
  const calculateNetSalary = (data) => {
    return Number(data.basicSalary) + Number(data.bonus) - Number(data.deductions);
  };

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newSalary = {
      ...formData,
      id: currentSalary ? currentSalary.id : salaries.length + 1,
      netSalary: calculateNetSalary(formData)
    };

    if (currentSalary) {
      setSalaries(salaries.map(salary => 
        salary.id === currentSalary.id ? newSalary : salary
      ));
    } else {
      setSalaries([...salaries, newSalary]);
    }

    setIsModalOpen(false);
    setCurrentSalary(null);
    setFormData({
      employeeName: '',
      position: '',
      basicSalary: 0,
      bonus: 0,
      deductions: 0,
      paymentDate: '',
      status: 'Pending'
    });
  };

  // Status badge styles
  const getStatusStyle = (status) => {
    const styles = {
      'Paid': 'bg-green-100 text-green-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Processing': 'bg-blue-100 text-blue-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  // Filter salaries based on search
  const filteredSalaries = salaries.filter(salary =>
    salary.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    salary.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
        <h1 className="text-2xl font-bold text-gray-900">Salary Management</h1>
        
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search employees..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={() => {
              setCurrentSalary(null);
              setFormData({
                employeeName: '',
                position: '',
                basicSalary: 0,
                bonus: 0,
                deductions: 0,
                paymentDate: '',
                status: 'Pending'
              });
              setIsModalOpen(true);
            }}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Salary Record
          </button>
        </div>
      </div>

      {/* Salary Records Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSalaries.map((salary) => (
          <div key={salary.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{salary.employeeName}</h3>
                  <p className="text-sm text-gray-600 mt-1">{salary.position}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(salary.status)}`}>
                  {salary.status}
                </span>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Basic Salary</span>
                  <span>${salary.basicSalary.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Bonus</span>
                  <span className="text-green-600">+${salary.bonus.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Deductions</span>
                  <span className="text-red-600">-${salary.deductions.toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Net Salary</span>
                    <span className="text-lg font-bold">${salary.netSalary.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Payment Date: {salary.paymentDate}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setCurrentSalary(salary);
                        setFormData(salary);
                        setIsModalOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal will go here - I can provide the modal code if needed */}
      {/* // Add this modal code inside your Salary.jsx, just before the final closing div */}

{/* Add/Edit Salary Modal */}
{isModalOpen && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">
                {currentSalary ? 'Edit Salary Record' : 'Add New Salary Record'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Employee Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Employee Name</label>
                    <input
                        type="text"
                        required
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={formData.employeeName}
                        onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                    />
                </div>

                {/* Position */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Position</label>
                    <input
                        type="text"
                        required
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    />
                </div>

                {/* Basic Salary */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Basic Salary</label>
                    <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={formData.basicSalary}
                        onChange={(e) => setFormData({ ...formData, basicSalary: parseFloat(e.target.value) })}
                    />
                </div>

                {/* Bonus */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Bonus</label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={formData.bonus}
                        onChange={(e) => setFormData({ ...formData, bonus: parseFloat(e.target.value) })}
                    />
                </div>

                {/* Deductions */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Deductions</label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={formData.deductions}
                        onChange={(e) => setFormData({ ...formData, deductions: parseFloat(e.target.value) })}
                    />
                </div>

                {/* Payment Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Payment Date</label>
                    <input
                        type="date"
                        required
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={formData.paymentDate}
                        onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                    />
                </div>

                {/* Status */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Processing">Processing</option>
                    </select>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        type="button"
                        onClick={() => {
                            setIsModalOpen(false);
                            setCurrentSalary(null);
                            setFormData({
                                employeeName: '',
                                position: '',
                                basicSalary: 0,
                                bonus: 0,
                                deductions: 0,
                                paymentDate: '',
                                status: 'Pending'
                            });
                        }}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                        {currentSalary ? 'Update' : 'Add'} Record
                    </button>
                </div>
            </form>
        </div>
    </div>
)}
    </div>
  );
}

export default Salary;