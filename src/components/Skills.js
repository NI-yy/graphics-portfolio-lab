import '../styles/Skills.css';

const icon = (name) => `${process.env.PUBLIC_URL}/skills/${name}-original.svg`;

const skills = [
  { name: 'Unity / C#', icons: ['unity', 'csharp'] },
  { name: 'Python', icons: ['python'] },
  { name: 'Arduino', icons: ['arduino'] },
  { name: 'Blender', icons: ['blender'] },
  { name: 'React / HTML / CSS', icons: ['react'] },
  { name: 'C++', icons: ['cplusplus'] },
];

export default function Skills() {
  return (
    <section className="skills-section">
      <h2>Skills</h2>
      <ul className="skills-grid">
        {skills.map(({ name, icons }) => (
          <li className="skill-item" key={name}>
            <span className="skill-icons" aria-hidden="true">
              {icons.map((item) => <img key={item} src={icon(item)} alt="" width="30" height="30" loading="lazy" />)}
            </span>
            <span className="skill-name">{name}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
