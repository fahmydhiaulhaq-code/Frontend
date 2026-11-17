import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = "http://localhost:3000/api/siswa";
const kosong = { kode_siswa: "", nama_siswa: "", alamat_siswa: "", tgl_siswa: "", jurusan_siswa: "" };

export default function App() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState(kosong);
  const [editing, setEditing] = useState(false);

  const load = async () => {
    try {
      setData((await axios.get(API)).data);
    } catch {
      alert("Gagal mengambil data. Pastikan backend sudah berjalan.");
    }
  };
  useEffect(() => { load(); }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const reset = () => { setForm(kosong); setEditing(false); };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) await axios.put(`${API}/${form.kode_siswa}`, form);
      else await axios.post(API, form);
      reset();
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Terjadi kesalahan");
    }
  };

  const onEdit = (s) => {
    setForm(s);
    setEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onDelete = async (kode) => {
    if (confirm("Hapus data ini?")) {
      await axios.delete(`${API}/${kode}`);
      load();
    }
  };

  return (
    <div className="container">
      <h1 className="title">Data Siswa</h1>
      <p className="subtitle">Kelola data siswa: tambah, ubah, dan hapus</p>

      <form className="card" onSubmit={onSubmit}>
        <h3>{editing ? "Edit Data Siswa" : "Tambah Data Siswa"}</h3>
        <div className="form-grid">
          <div className="field">
            <label>Kode Siswa</label>
            <input name="kode_siswa" placeholder="Contoh: S001" value={form.kode_siswa}
              onChange={onChange} disabled={editing} required />
          </div>
          <div className="field">
            <label>Nama Siswa</label>
            <input name="nama_siswa" placeholder="Nama lengkap" value={form.nama_siswa}
              onChange={onChange} required />
          </div>
          <div className="field full">
            <label>Alamat</label>
            <input name="alamat_siswa" placeholder="Alamat lengkap" value={form.alamat_siswa}
              onChange={onChange} />
          </div>
          <div className="field">
            <label>Tanggal</label>
            <input type="date" name="tgl_siswa" value={form.tgl_siswa} onChange={onChange} />
          </div>
          <div className="field">
            <label>Jurusan</label>
            <input name="jurusan_siswa" placeholder="Contoh: Teknik Informatika"
              value={form.jurusan_siswa} onChange={onChange} />
          </div>
          <div className="actions">
            <button className="btn btn-primary">{editing ? "Simpan Perubahan" : "Tambah Data"}</button>
            {editing && (
              <button type="button" className="btn btn-secondary" onClick={reset}>Batal</button>
            )}
          </div>
        </div>
      </form>

      <div className="card">
        <div className="table-head">
          <h3>Daftar Siswa</h3>
          <span className="badge">{data.length} data</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Kode</th>
                <th>Nama</th>
                <th>Alamat</th>
                <th>Tanggal</th>
                <th>Jurusan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr><td colSpan="6" className="empty">Belum ada data siswa</td></tr>
              ) : (
                data.map((s) => (
                  <tr key={s.kode_siswa}>
                    <td className="kode">{s.kode_siswa}</td>
                    <td>{s.nama_siswa}</td>
                    <td>{s.alamat_siswa}</td>
                    <td>{s.tgl_siswa}</td>
                    <td><span className="jurusan-tag">{s.jurusan_siswa}</span></td>
                    <td>
                      <div className="aksi">
                        <button className="btn btn-sm btn-edit" onClick={() => onEdit(s)}>Edit</button>
                        <button className="btn btn-sm btn-delete" onClick={() => onDelete(s.kode_siswa)}>Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}