import logo from '../../assets/loan-logo-hand.svg'

function Logo({ className = '' }) {
  return <img src={logo} alt="Loan Management Logo" className={className} />
}

export default Logo
